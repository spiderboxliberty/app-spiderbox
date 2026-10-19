import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bike,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Compass,
  Flag,
  LayoutDashboard,
  Leaf,
  LoaderCircle,
  MapPin,
  Menu,
  Mountain,
  Radio,
  Route,
  Send,
  Settings2,
  ShieldCheck,
  Sprout,
  Users,
  X,
} from 'lucide-react';
import type { Circuit, Overview, Partner, Session } from './domain';
import { fieldChecklist } from './domain';
import { api } from './api';

const navigation = [
  { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { id: 'stations', label: 'Mes SpiderBox', icon: Bike },
  { id: 'circuits', label: 'Mes circuits', icon: Route },
  { id: 'partners', label: 'Mes partenaires', icon: Users },
  { id: 'network', label: 'Lien avec le réseau', icon: Radio },
] as const;
type Page = (typeof navigation)[number]['id'];
const statusLabel = (c: Circuit) =>
  c.status === 'prepared' ? 'Essai préparé' : 'À découvrir sur le terrain';

export function App() {
  const [session, setSession] = useState<Session>();
  const [data, setData] = useState<Overview>();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [page, setPage] = useState<Page>('overview');
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState<Circuit>();
  const [pending, setPending] = useState(false);
  const [preview, setPreview] = useState(false);
  const requestId = useRef('');
  const interaction = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const reload = async () => setData(await api<Overview>('/overview'));
  const load = async () => {
    setError('');
    try {
      setSession(await api<Session>('/session'));
      await reload();
    } catch (e) {
      setError((e as Error).message);
    }
  };
  useEffect(() => {
    void load();
  }, []); // Initial session is a local demo fixture.
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  const navigate = (next: Page) => {
    interaction.current++;
    setPage(next);
    setMenu(false);
    setNotice('');
    setError('');
  };
  const openCircuit = (circuit: Circuit) => {
    interaction.current++;
    setSelected(circuit);
    setPreview(false);
    requestId.current = crypto.randomUUID();
  };
  const closeCircuit = () => {
    interaction.current++;
    setSelected(undefined);
  };
  const mutate = async (operation: () => Promise<void>, success: string) => {
    setPending(true);
    setError('');
    setNotice('');
    try {
      await operation();
      await reload();
      setNotice(success);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  };
  const prepare = () => {
    if (!selected) return;
    const initiatingInteraction = interaction.current;
    void mutate(async () => {
      const updated = await api<Circuit>(`/circuits/${selected.id}/prepare`, {
        method: 'POST',
        body: JSON.stringify({ version: selected.version }),
      });
      if (interaction.current === initiatingInteraction) setSelected(updated);
    }, 'Essai préparé. La validation terrain reste à réaliser.');
  };
  const submit = () => {
    if (!selected) return;
    const initiatingInteraction = interaction.current;
    void mutate(async () => {
      await api('/submissions', {
        method: 'POST',
        body: JSON.stringify({
          circuitId: selected.id,
          version: selected.version,
          requestId: requestId.current,
        }),
      });
      if (interaction.current === initiatingInteraction) {
        closeCircuit();
        setPage('network');
      }
    }, 'Transmission de démonstration reçue. Aucune publication effectuée.');
  };
  const savePartner = (partner: Partner, values: Pick<Partner, 'status' | 'note' | 'reminder'>) =>
    void mutate(async () => {
      await api(`/partners/${partner.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...values, version: partner.version }),
      });
    }, 'Relation partenaire enregistrée dans la démonstration.');

  if (!data || !session)
    return (
      <main className="loading">
        <Sprout size={36} />
        <h1>SpiderBox Liberty</h1>
        {error ? (
          <>
            <p role="alert">{error}</p>
            <button onClick={() => void load()}>Réessayer</button>
          </>
        ) : (
          <p>
            <LoaderCircle className="spin" size={18} /> Ouverture de votre espace…
          </p>
        )}
      </main>
    );

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <aside className={`sidebar ${menu ? 'is-open' : ''}`} aria-label="Navigation principale">
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            navigate('overview');
          }}
          aria-label="SpiderBox Liberty, accueil"
        >
          <span className="brand-icon">
            <Sprout />
          </span>
          <span>
            spiderbox<span className="brand-sub">LIBERTY</span>
          </span>
        </a>
        <div className="workspace-label">ESPACE EXPLOITANT</div>
        <div className="organization">
          <span className="org-icon">
            <Leaf size={20} />
          </span>
          <div>
            Les Rives<small>Organisation fictive</small>
          </div>
          <ShieldCheck size={16} />
        </div>
        <nav>
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={page === id ? 'active' : ''}
              aria-label={label}
              aria-current={page === id ? 'page' : undefined}
              onClick={() => navigate(id)}
            >
              <Icon size={20} />
              <span>{label}</span>
              {id === 'circuits' && (
                <span className="nav-count" aria-hidden="true">
                  {data.circuits.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <Sprout size={26} />
          <h3>Le terrain, ensemble.</h3>
          <p>
            Des découvertes locales.
            <br />
            Des liens qui font avancer.
          </p>
        </div>
        <div className="sidebar-bottom">
          <span>
            <ShieldCheck size={17} /> Périmètre professionnel privé
          </span>
          <span>
            <CircleHelp size={17} /> Version de démonstration 0.1
          </span>
        </div>
      </aside>
      {menu && (
        <button
          className="menu-backdrop"
          aria-label="Fermer la navigation"
          onClick={() => setMenu(false)}
        />
      )}
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label={menu ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
            <span>Mon espace</span>
            <ChevronRight size={14} />
            <strong>{navigation.find((n) => n.id === page)?.label}</strong>
          </div>
          <div className="user">
            <span className="demo-pill">
              <span /> Démonstration
            </span>
            <div className="avatar" aria-hidden="true">
              CM
            </div>
            <span className="user-name">
              Camille Martin<small>Exploitante · compte fictif</small>
            </span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <div className="demo-banner">
            <ShieldCheck size={17} />
            <p>
              Données fictives · Aucun service externe connecté · Modifications effacées au
              redémarrage.
            </p>
          </div>
          {error && (
            <div className="message error" role="alert">
              {error}
              <button onClick={() => setError('')} aria-label="Fermer l’erreur">
                <X size={16} />
              </button>
            </div>
          )}
          {notice && (
            <div className="message success" role="status">
              {notice}
              <button onClick={() => setNotice('')} aria-label="Fermer la notification">
                <X size={16} />
              </button>
            </div>
          )}
          <div className="page-heading">
            <div>
              <div className="eyebrow">VOTRE AVENTURE LOCALE</div>
              <h1>
                {page === 'overview'
                  ? 'Bonjour Camille'
                  : navigation.find((n) => n.id === page)?.label}
                {page === 'overview' && (
                  <span className="heading-leaf">
                    <Leaf size={26} />
                  </span>
                )}
              </h1>
              <p>
                {page === 'overview'
                  ? 'Un regard sur votre activité, un pas vers la prochaine découverte.'
                  : page === 'circuits'
                    ? 'De la découverte documentaire à l’essai sur votre terrain.'
                    : page === 'stations'
                      ? 'Vos stations, leurs sites et leurs configurations.'
                      : page === 'partners'
                        ? 'Cultivez vos relations locales dans votre périmètre privé.'
                        : 'Choisissez ce que vous transmettez. Le réseau examine avant publication.'}
              </p>
            </div>
            <span className="private-label">
              <ShieldCheck size={15} /> Votre organisation uniquement
            </span>
          </div>
          {page === 'overview' && (
            <>
              <section className="hero-card" aria-labelledby="hero-title">
                <div className="hero-content">
                  <span className="hero-kicker">
                    <span /> LE GOÛT DE LA DÉCOUVERTE
                  </span>
                  <h2 id="hero-title">
                    De nouveaux chemins.
                    <br />
                    De belles rencontres.
                  </h2>
                  <p>
                    Préparez vos circuits et faites grandir
                    <br className="desktop-break" /> votre activité, à votre rythme.
                  </p>
                  <button className="button lime" onClick={() => navigate('circuits')}>
                    Explorer mes circuits <ArrowUpRight size={18} />
                  </button>
                  <span className="hero-footnote">
                    Chaque parcours commence par un essai terrain.
                  </span>
                </div>
                <Landscape />
              </section>
              <section className="stats-grid" aria-label="Repères de votre organisation">
                <Stat
                  icon={<Bike />}
                  value={String(data.stations.length).padStart(2, '0')}
                  title="SpiderBox dans votre périmètre"
                  detail="1 fixe · 1 mobile (fictives)"
                />
                <Stat
                  icon={<Route />}
                  value={String(data.circuits.length).padStart(2, '0')}
                  title="Circuits à explorer"
                  detail="Aucun circuit validé localement"
                />
                <Stat
                  icon={<Users />}
                  value={String(data.partners.length).padStart(2, '0')}
                  title="Partenaires à vos côtés"
                  detail="Relations de démonstration"
                />
                <Stat
                  icon={<Settings2 />}
                  value="Inconnu"
                  title="Total de créneaux disponibles"
                  detail="Réservations et technique non raccordées"
                  unknown
                />
              </section>
              <div className="overview-grid">
                <section className="panel">
                  <SectionTitle
                    eyebrow="SUR LE TERRAIN"
                    title="Vos prochains circuits"
                    action="Tout voir"
                    onClick={() => navigate('circuits')}
                  />
                  <div className="circuit-list">
                    {data.circuits.map((c, i) => (
                      <CircuitRow key={c.id} circuit={c} index={i} onClick={() => openCircuit(c)} />
                    ))}
                  </div>
                  <div className="panel-foot">
                    <ShieldCheck size={16} />
                    <span>Une découverte documentaire ne vaut pas validation terrain.</span>
                  </div>
                </section>
                <section className="panel next-steps">
                  <SectionTitle eyebrow="UN PAS APRÈS L’AUTRE" title="Pour bien commencer" />
                  <Step
                    number="01"
                    title="Retrouvez vos stations"
                    text="Identifiez le site et la configuration."
                    onClick={() => navigate('stations')}
                  />
                  <Step
                    number="02"
                    title="Préparez un essai terrain"
                    text="Votre station, votre lieu, votre parcours."
                    onClick={() => navigate('circuits')}
                  />
                  <Step
                    number="03"
                    title="Tissez des liens locaux"
                    text="Un contact, une note, un prochain pas."
                    onClick={() => navigate('partners')}
                  />
                </section>
              </div>
              <section className="network-strip">
                <span className="network-icon">
                  <Radio size={24} />
                </span>
                <div>
                  <h3>Votre expérience fait avancer le réseau.</h3>
                  <p>Transmettez un circuit à l’administrateur, après avoir vérifié son contenu.</p>
                </div>
                <button className="button outline" onClick={() => navigate('network')}>
                  Mon lien réseau <ArrowRight size={17} />
                </button>
              </section>
            </>
          )}
          {page === 'stations' && (
            <>
              <div className="cards-two">
                {data.stations.map((station) => (
                  <section className="panel station-card" key={station.id}>
                    <div className="station-top">
                      <span className="square-icon">
                        <Bike size={28} />
                      </span>
                      <span className="badge neutral">{station.profile}</span>
                    </div>
                    <h2>{station.name}</h2>
                    <p>
                      <MapPin size={17} /> {station.site}
                    </p>
                    <dl>
                      <div>
                        <dt>Fuseau du site</dt>
                        <dd>{station.timezone}</dd>
                      </div>
                      <div>
                        <dt>Configuration</dt>
                        <dd>{station.configurationVersion}</dd>
                      </div>
                      <div>
                        <dt>Disponibilité technique</dt>
                        <dd>Inconnue · Agent 1 absent</dd>
                      </div>
                    </dl>
                  </section>
                ))}
              </div>
              <div className="info-box">
                <MapPin size={22} />
                <p>
                  La position de votre téléphone ne déplace jamais une station. La confirmation des
                  sites et des affectations sera raccordée après l’audit Supabase.
                </p>
              </div>
            </>
          )}
          {page === 'circuits' && (
            <>
              <div className="info-box">
                <Flag size={22} />
                <p>
                  Aucun parcours n’est exploitable sur la seule base de cette démonstration. Un
                  essai intégral, ses preuves et les conditions de lancement restent nécessaires.
                </p>
              </div>
              <div className="cards-two">
                {data.circuits.map((c, i) => (
                  <section className="panel circuit-card" key={c.id}>
                    <div className={`circuit-art art-${i}`}>
                      <RouteSketch variant={i} />
                      <span>ITINÉRAIRE FICTIF · NON NAVIGABLE</span>
                    </div>
                    <div className="circuit-body">
                      <span className="badge">{statusLabel(c)}</span>
                      <h2>{c.name}</h2>
                      <p>{c.description}</p>
                      <div className="circuit-meta">
                        <span>{c.distanceKm.toLocaleString('fr-FR')} km</span>
                        <span>≈ {c.durationMinutes} min</span>
                        <span>Version {c.version}</span>
                      </div>
                      <button className="button dark" onClick={() => openCircuit(c)}>
                        Ouvrir le dossier <ArrowRight size={17} />
                      </button>
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}
          {page === 'partners' && (
            <div className="cards-two">
              {data.partners.map((p) => (
                <PartnerEditor
                  key={`${p.id}-${p.version}`}
                  partner={p}
                  pending={pending}
                  onSave={(values) => savePartner(p, values)}
                />
              ))}
            </div>
          )}
          {page === 'network' && (
            <>
              <div className="info-box">
                <ShieldCheck size={22} />
                <p>
                  Les transmissions sont destinées à l’administrateur réseau. Aucune messagerie
                  entre exploitants et aucune publication automatique. Les notes privées et les
                  finances sont exclues.
                </p>
              </div>
              <section className="panel transmission-panel">
                <SectionTitle eyebrow="TRANSMISSIONS EXPLICITES" title="Mes envois au réseau" />
                {data.submissions.length ? (
                  data.submissions.map((s) => (
                    <article className="submission" key={s.id}>
                      <span className="square-icon">
                        <ArrowUpRight size={23} />
                      </span>
                      <div>
                        <h3>{s.title}</h3>
                        <p>
                          Version {s.circuitVersion} ·{' '}
                          {new Intl.DateTimeFormat('fr-FR', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            timeZone: 'Europe/Paris',
                          }).format(new Date(s.sentAt))}{' '}
                          · Europe/Paris
                        </p>
                      </div>
                      <span className="badge">Reçu en démonstration</span>
                    </article>
                  ))
                ) : (
                  <div className="empty-state">
                    <Send size={35} />
                    <h3>Vos échanges commencent ici.</h3>
                    <p>Ouvrez un circuit et vérifiez l’aperçu avant de le transmettre.</p>
                    <button className="button dark" onClick={() => navigate('circuits')}>
                      Choisir un circuit <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
          <footer>
            <span>
              spiderbox <b>LIBERTY</b>
              <span className="footer-dot">·</span> Explorer local. Avancer ensemble.
            </span>
            <span>Socle 0.1 · Démonstration isolée</span>
          </footer>
        </main>
      </div>
      <dialog
        ref={dialog}
        onCancel={closeCircuit}
        onClose={() => {
          if (!dialog.current?.open) closeCircuit();
        }}
        aria-labelledby="circuit-title"
      >
        <div className="dialog-header">
          <span className="eyebrow">DOSSIER CIRCUIT · DÉMONSTRATION</span>
          <button className="icon-button" aria-label="Fermer le dossier" onClick={closeCircuit}>
            <X />
          </button>
        </div>
        {selected && (
          <div className="dialog-body">
            <span className="badge">{statusLabel(selected)}</span>
            <h2 id="circuit-title">{selected.name}</h2>
            <p>{selected.description}</p>
            <dl>
              <div>
                <dt>Station / site</dt>
                <dd>
                  {data.stations.find((s) => s.id === selected.stationId)?.name} · Site des Rives
                </dd>
              </div>
              <div>
                <dt>Version du circuit</dt>
                <dd>{selected.version}</dd>
              </div>
              <div>
                <dt>Validation locale</dt>
                <dd>Non réalisée</dd>
              </div>
              <div>
                <dt>Lancement commercial</dt>
                <dd>Non autorisé · décision H.09 requise</dd>
              </div>
            </dl>
            {preview ? (
              <section className="preview">
                <h3>Aperçu du contenu transmis</h3>
                <p>Destinataire : administrateur réseau.</p>
                <ul>
                  <li>Titre : {selected.name}</li>
                  <li>Identifiant : {selected.id}</li>
                  <li>Version du circuit : {selected.version}</li>
                  <li>Organisation et auteur de la transmission</li>
                </ul>
                <p>
                  <ShieldCheck size={17} /> Notes partenaires, données clients, photos et finances
                  exclues.
                </p>
                <p>Réception simulée en mémoire ; aucun administrateur réel n’est contacté.</p>
                <div className="dialog-actions">
                  <button
                    className="button outline"
                    disabled={pending}
                    onClick={() => setPreview(false)}
                  >
                    Retour au dossier
                  </button>
                  <button className="button dark" disabled={pending} onClick={submit}>
                    {pending ? 'Envoi…' : 'Confirmer la transmission fictive'}
                    <Send size={17} />
                  </button>
                </div>
              </section>
            ) : (
              <>
                <h3>Checklist à vérifier pendant l’essai</h3>
                <ul className="checklist">
                  {fieldChecklist.map((item) => (
                    <li key={item}>
                      <span className="empty-check" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="info-box compact">
                  <CircleHelp size={19} />
                  <p>
                    La préparation ne coche aucun contrôle. Capture de trace, photos et validation
                    nominative seront ajoutées dans le lot terrain.
                  </p>
                </div>
                <div className="dialog-actions">
                  {selected.status === 'documentary' ? (
                    <button className="button dark" onClick={prepare} disabled={pending}>
                      {pending ? 'Préparation…' : 'Préparer l’essai'}
                      <Flag size={17} />
                    </button>
                  ) : (
                    <span className="prepared">
                      <CheckCircle2 size={18} /> Essai préparé, à réaliser
                    </span>
                  )}
                  <button
                    className="button outline"
                    onClick={() => setPreview(true)}
                    disabled={pending}
                  >
                    Aperçu de transmission <ArrowUpRight size={17} />
                  </button>
                </div>
              </>
            )}
            {error && (
              <p role="alert" className="dialog-error">
                {error}
              </p>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}

function Stat({
  icon,
  value,
  title,
  detail,
  unknown,
}: {
  icon: React.ReactNode;
  value: string;
  title: string;
  detail: string;
  unknown?: boolean;
}) {
  return (
    <article className="stat">
      <div className="stat-top">
        <span className="stat-icon">{icon}</span>
        {!unknown && <ArrowDownLeft size={17} />}
      </div>
      <strong className={unknown ? 'unknown-value' : ''}>{value}</strong>
      <h2>{title}</h2>
      <p>{detail}</p>
    </article>
  );
}
function SectionTitle({
  eyebrow,
  title,
  action,
  onClick,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {action && (
        <button className="text-button" onClick={onClick}>
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}
function CircuitRow({
  circuit,
  index,
  onClick,
}: {
  circuit: Circuit;
  index: number;
  onClick: () => void;
}) {
  return (
    <button className="circuit-row" onClick={onClick}>
      <span className={`route-thumb thumb-${index}`}>
        {index ? <Mountain size={26} /> : <Route size={26} />}
      </span>
      <span className="circuit-row-info">
        <strong>{circuit.name}</strong>
        <span>
          {circuit.distanceKm.toLocaleString('fr-FR')} km <span className="dot">·</span> ≈{' '}
          {circuit.durationMinutes} min <span className="dot">·</span> Fictif
        </span>
        <span className="route-status">
          <span />
          {statusLabel(circuit)}
        </span>
      </span>
      <ChevronRight size={19} />
    </button>
  );
}
function Step({
  number,
  title,
  text,
  onClick,
}: {
  number: string;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button className="step" onClick={onClick}>
      <span className="step-number">{number}</span>
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <ArrowUpRight size={17} />
    </button>
  );
}
function PartnerEditor({
  partner,
  pending,
  onSave,
}: {
  partner: Partner;
  pending: boolean;
  onSave: (values: Pick<Partner, 'status' | 'note' | 'reminder'>) => void;
}) {
  const [status, setStatus] = useState(partner.status);
  const [note, setNote] = useState(partner.note);
  const [reminder, setReminder] = useState(partner.reminder ?? '');
  return (
    <section className="panel partner-card">
      <div className="station-top">
        <span className="square-icon">
          <Users size={26} />
        </span>
        <span className="badge neutral">Relation privée</span>
      </div>
      <h2>{partner.name}</h2>
      <p>
        {partner.category} · {partner.contact}
      </p>
      <p className="muted">Téléphone confirmé indisponible. Aucun appel proposé.</p>
      <form
        aria-busy={pending}
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ status, note, reminder: reminder || null });
        }}
      >
        <label>
          Statut
          <select
            aria-label="Statut"
            disabled={pending}
            value={status}
            onChange={(e) => setStatus(e.target.value as Partner['status'])}
          >
            <option>À contacter</option>
            <option>En échange</option>
            <option>À rappeler</option>
          </select>
        </label>
        <label>
          Notes privées
          <textarea
            disabled={pending}
            value={note}
            maxLength={2000}
            rows={4}
            placeholder="Les points à retenir pour votre prochain échange…"
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <label>
          Rappel · date locale
          <input
            disabled={pending}
            type="date"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
        </label>
        <small>Rappel enregistré uniquement ; aucune notification automatique.</small>
        <button className="button dark" disabled={pending} type="submit">
          <Check size={17} /> Enregistrer
        </button>
      </form>
    </section>
  );
}
function Landscape() {
  return (
    <div className="landscape" aria-hidden="true">
      <svg viewBox="0 0 650 380" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#9aac85" />
            <stop offset="1" stopColor="#536f56" />
          </linearGradient>
        </defs>
        <rect width="650" height="380" fill="#b5c7a4" />
        <path d="M-30 120Q100 5 220 70T470 60T710 20V380H0Z" fill="#8fa983" />
        <path d="M-10 220Q140 130 240 160T460 110T700 170V400H0Z" fill="url(#land)" />
        <path d="M-10 330Q190 160 300 235T690 180V400H0Z" fill="#486b51" />
        <path d="M560-40Q350 120 455 190T300 420" fill="none" stroke="#cadaad" strokeWidth="36" />
        <path d="M590-40Q360 135 475 192T330 420" fill="none" stroke="#dce7bf" strokeWidth="10" />
        <g fill="#305640">
          <circle cx="120" cy="100" r="22" />
          <circle cx="144" cy="118" r="18" />
          <circle cx="80" cy="123" r="24" />
          <circle cx="560" cy="286" r="24" />
          <circle cx="595" cy="298" r="30" />
          <circle cx="527" cy="315" r="24" />
        </g>
        <path
          d="M190 310C100 270 200 215 300 230S490 160 385 116"
          fill="none"
          stroke="#e9f4ac"
          strokeWidth="3"
          strokeDasharray="7 8"
        />
        <circle cx="190" cy="310" r="9" fill="#e9f4ac" stroke="#345c43" strokeWidth="4" />
        <g transform="translate(371 80)">
          <rect width="30" height="39" rx="15" fill="#def497" />
          <circle cx="15" cy="15" r="6" fill="#28503c" />
          <path d="m5 31 10 15 10-15" fill="#def497" />
        </g>
        <g transform="translate(258 265)" stroke="#e5edcf" fill="none" strokeWidth="3">
          <circle cx="0" cy="25" r="13" />
          <circle cx="46" cy="25" r="13" />
          <path d="M0 25 15 3 31 25H0L10 7h28l8 18M30-3h10M12 0H4" />
        </g>
      </svg>
      <span className="landscape-label">
        <Compass size={14} /> Illustration · itinéraire fictif
      </span>
    </div>
  );
}
function RouteSketch({ variant }: { variant: number }) {
  return (
    <svg viewBox="0 0 500 180" aria-hidden="true">
      <path
        d="M-20 120Q70 20 150 100T360 80T530 20"
        stroke={variant ? '#b3c49e' : '#b9d0c3'}
        strokeWidth="60"
        fill="none"
      />
      <path
        d="M90 140Q60 30 180 55T370 120T280 150T90 140"
        stroke="#496d4d"
        fill="none"
        strokeWidth="3"
        strokeDasharray="6 5"
      />
      <circle cx="90" cy="140" r="8" fill="#e7f4b0" stroke="#496d4d" strokeWidth="3" />
    </svg>
  );
}
