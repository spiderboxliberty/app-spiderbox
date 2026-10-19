-- Inventory only. Run on the EXISTING SpiderBox project after access/reactivation.
-- Keep results private: metadata includes the actual authorization policy expressions.
-- This file reads catalogs only; it is not an application migration or a data dump.
BEGIN TRANSACTION READ ONLY;
SET LOCAL statement_timeout = '20s';
SET LOCAL lock_timeout = '3s';

SELECT jsonb_build_object(
  'captured_at_utc', to_char(clock_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
  'database', current_database(),
  'execution_role', current_user,
  'postgres_version', current_setting('server_version'),
  'scope', 'catalog metadata only; not authentication, API exposure or RLS effectiveness proof'
) AS audit_context;

SELECT n.nspname AS schema_name,
       c.relname AS relation_name,
       c.relkind AS relation_kind,
       pg_get_userbyid(c.relowner) AS owner_role,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced
FROM pg_catalog.pg_class c
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND n.nspname NOT LIKE 'pg_toast%'
  AND n.nspname NOT LIKE 'pg_temp_%'
  AND c.relkind IN ('r', 'p', 'v', 'm', 'f')
ORDER BY n.nspname, c.relname;

SELECT table_schema, table_name, column_name, ordinal_position,
       data_type, udt_schema, udt_name, is_nullable,
       is_identity, is_generated
FROM information_schema.columns
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name, ordinal_position;

SELECT n.nspname AS schema_name, c.relname AS relation_name,
       con.conname AS constraint_name, con.contype AS constraint_kind,
       pg_get_constraintdef(con.oid, true) AS definition
FROM pg_catalog.pg_constraint con
JOIN pg_catalog.pg_class c ON c.oid = con.conrelid
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY n.nspname, c.relname, con.conname;

SELECT schemaname, tablename, policyname, permissive, roles, cmd,
       qual AS using_expression, with_check AS check_expression
FROM pg_catalog.pg_policies
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY schemaname, tablename, policyname;

SELECT n.nspname AS schema_name,
       p.proname AS function_name,
       pg_get_function_identity_arguments(p.oid) AS identity_arguments,
       pg_get_userbyid(p.proowner) AS owner_role,
       p.prosecdef AS security_definer,
       p.proleakproof AS leakproof,
       p.proacl AS execute_acl,
       ARRAY(SELECT setting FROM unnest(p.proconfig) AS setting
             WHERE setting LIKE 'search_path=%') AS configured_search_path
FROM pg_catalog.pg_proc p
JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY n.nspname, p.proname, identity_arguments;

SELECT n.nspname AS schema_name, c.relname AS relation_name,
       t.tgname AS trigger_name, t.tgenabled AS enabled_mode,
       fn.nspname AS function_schema, p.proname AS function_name
FROM pg_catalog.pg_trigger t
JOIN pg_catalog.pg_class c ON c.oid = t.tgrelid
JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
JOIN pg_catalog.pg_proc p ON p.oid = t.tgfoid
JOIN pg_catalog.pg_namespace fn ON fn.oid = p.pronamespace
WHERE NOT t.tgisinternal
  AND n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY n.nspname, c.relname, t.tgname;

SELECT table_schema, table_name, grantor, grantee,
       privilege_type, is_grantable
FROM information_schema.table_privileges
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name, grantee, privilege_type;

SELECT n.nspname AS schema_name, n.nspacl AS schema_acl
FROM pg_catalog.pg_namespace n
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND n.nspname NOT LIKE 'pg_toast%'
  AND n.nspname NOT LIKE 'pg_temp_%'
ORDER BY n.nspname;

SELECT extname AS extension_name, extversion AS installed_version,
       n.nspname AS schema_name
FROM pg_catalog.pg_extension e
JOIN pg_catalog.pg_namespace n ON n.oid = e.extnamespace
ORDER BY extname;

ROLLBACK;
