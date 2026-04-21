import { useState, useEffect, useRef, type ReactNode } from "react";
import { ChevronDown, ChevronRight, Moon, Sun, Plus, ArrowLeft, Trash2, Check } from "lucide-react";

/* ─── TYPES ─── */
interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: "draft" | "pending" | "paid";
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
}

interface FormData {
  senderStreet: string;
  senderCity: string;
  senderPostCode: string;
  senderCountry: string;
  clientName: string;
  clientEmail: string;
  clientStreet: string;
  clientCity: string;
  clientPostCode: string;
  clientCountry: string;
  createdAt: string;
  paymentTerms: string | number;
  description: string;
  items: InvoiceItem[];
}

/* ─── UTILS ─── */
const uid = (): string => {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return c[Math.floor(Math.random()*26)] + c[Math.floor(Math.random()*26)] + (Math.floor(Math.random()*9000)+1000);
};
const fmt = (n: number): string => new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"}).format(n||0);
const fmtDate = (s: string): string => { if(!s) return ""; const d=new Date(s+"T00:00:00"); return d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); };
const todayStr = (): string => new Date().toISOString().slice(0,10);
const addDays = (date: string, days: number): string => { const d=new Date(date+"T00:00:00"); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); };

/* ─── SAMPLE DATA ─── */
const SAMPLES: Invoice[] = [
  { id:"RT3080", createdAt:"2021-08-18", paymentDue:"2021-09-19", description:"Re-branding", paymentTerms:30, clientName:"Jensen Huang", clientEmail:"jensenh@mail.com", status:"paid" as const,
    senderAddress:{street:"19 Union Terrace",city:"London",postCode:"E1 3EZ",country:"United Kingdom"},
    clientAddress:{street:"106 Kendell Street",city:"Sharrington",postCode:"NR24 5WQ",country:"United Kingdom"},
    items:[{id:"i1",name:"Brand Guidelines",quantity:1,price:1800.90,total:1800.90}], total:1800.90 },
  { id:"XM9141", createdAt:"2021-08-21", paymentDue:"2021-09-20", description:"Graphic Design", paymentTerms:30, clientName:"Alex Grim", clientEmail:"alexgrim@mail.com", status:"pending" as const,
    senderAddress:{street:"19 Union Terrace",city:"London",postCode:"E1 3EZ",country:"United Kingdom"},
    clientAddress:{street:"84 Church Way",city:"Bradford",postCode:"BD1 9PB",country:"United Kingdom"},
    items:[{id:"i2",name:"Banner Design",quantity:1,price:156.00,total:156.00},{id:"i3",name:"Email Design",quantity:2,price:200.00,total:400.00}], total:556.00 },
  { id:"RG0314", createdAt:"2021-09-24", paymentDue:"2021-10-01", description:"Website Redesign", paymentTerms:7, clientName:"John Morrison", clientEmail:"jm@myco.com", status:"paid" as const,
    senderAddress:{street:"19 Union Terrace",city:"London",postCode:"E1 3EZ",country:"United Kingdom"},
    clientAddress:{street:"79 Dover Road",city:"Westhall",postCode:"IP19 3PF",country:"United Kingdom"},
    items:[{id:"i4",name:"Website Redesign",quantity:1,price:14002.33,total:14002.33}], total:14002.33 },
  { id:"AA1449", createdAt:"2021-10-07", paymentDue:"2021-10-14", description:"Logo Concept", paymentTerms:7, clientName:"Alysa Werner", clientEmail:"alysa@email.co.uk", status:"pending" as const,
    senderAddress:{street:"19 Union Terrace",city:"London",postCode:"E1 3EZ",country:"United Kingdom"},
    clientAddress:{street:"63 Warwick Road",city:"Carlisle",postCode:"CA20 2TG",country:"United Kingdom"},
    items:[{id:"i5",name:"Logo Sketches",quantity:1,price:102.04,total:102.04}], total:102.04 },
  { id:"TY9141", createdAt:"2021-10-08", paymentDue:"2021-10-15", description:"Monthly Retainer", paymentTerms:7, clientName:"Mellisa Clarke", clientEmail:"mellisa.clarke@example.com", status:"draft" as const,
    senderAddress:{street:"19 Union Terrace",city:"London",postCode:"E1 3EZ",country:"United Kingdom"},
    clientAddress:{street:"46 Abbey Row",city:"Cambridge",postCode:"CB5 6EG",country:"United Kingdom"},
    items:[{id:"i6",name:"New Logo",quantity:1,price:3102.04,total:3102.04}], total:3102.04 },
];

/* ─── GLOBAL STYLES ─── */
function useGlobalStyles(): void {
  useEffect(() => {
    if (!document.getElementById("inv-fonts")) {
      const l = document.createElement("link");
      l.id = "inv-fonts"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap";
      document.head.appendChild(l);
    }
    let st = document.getElementById("inv-styles");
    if (!st) { st = document.createElement("style"); st.id = "inv-styles"; document.head.appendChild(st); }
    st.textContent = `
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      :root{--accent:#7C5CBF;--accent-h:#9277FF;--danger:#EC5757;--danger-h:#FF9797;--green:#33D69F;--orange:#FF8F00;--fh:'Syne',sans-serif;--fm:'DM Mono',monospace}
      [data-theme=dark]{--bg:#141625;--surf:#1E2139;--elev:#252945;--t1:#FFFFFF;--t2:#888EB0;--t3:#7E88C3;--bdr:#252945;--shd:0 10px 40px rgba(0,0,0,.5);--sbg:#1E2139;--total-bg:#373B53}
      [data-theme=light]{--bg:#F8F8FB;--surf:#FFFFFF;--elev:#F9FAFE;--t1:#0C0E16;--t2:#888EB0;--t3:#7E88C3;--bdr:#DFE3FA;--shd:0 10px 40px rgba(72,84,159,.12);--sbg:#373B53;--total-bg:#0C0E16}
      html,body{background:var(--bg);color:var(--t1);font-family:sans-serif;min-height:100vh;transition:background .3s,color .3s;overflow-x:hidden}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:3px}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideIn{from{opacity:0;transform:translateX(-100%)}to{opacity:1;transform:translateX(0)}}
      @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
      @keyframes fadeInBg{from{opacity:0}to{opacity:1}}
      .fadeUp{animation:fadeUp .4s ease both}
      .inv-card{transition:border-color .2s,transform .2s,box-shadow .2s}
      .inv-card:hover{border-color:var(--accent)!important;transform:translateY(-2px);box-shadow:var(--shd)}
      .btn{font-family:var(--fh);font-size:14px;font-weight:700;border:none;cursor:pointer;border-radius:24px;padding:14px 24px;transition:background .2s,transform .15s;white-space:nowrap}
      .btn:active{transform:scale(.98)}
      .btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{background:var(--accent-h)}
      .btn-danger{background:var(--danger);color:#fff}.btn-danger:hover{background:var(--danger-h)}
      .btn-soft{background:var(--elev);color:var(--t2)}.btn-soft:hover{color:var(--t1)}
      [data-theme=light] .btn-soft{background:#F9FAFE}
      .btn-dark{background:#373B53;color:#DFE3FA}.btn-dark:hover{background:#0C0E16}
      [data-theme=light] .btn-dark{background:#0C0E16}
      .inp{background:var(--surf);border:1px solid var(--bdr);border-radius:4px;padding:15px 20px;font-family:var(--fh);font-size:13px;font-weight:700;color:var(--t1);outline:none;width:100%;transition:border-color .2s}
      .inp:focus{border-color:var(--accent)}
      .inp.err{border-color:var(--danger)}
      .inp::placeholder{color:var(--t3);font-weight:400}
      .sel{appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='11' height='7' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4.228 4.228L9.456 1' stroke='%237C5CBF' stroke-width='2' fill='none'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:calc(100% - 16px) center;cursor:pointer}
      .filter-opt{cursor:pointer;transition:color .2s}.filter-opt:hover{color:var(--accent)}
      .theme-btn{background:transparent;border:none;cursor:pointer;padding:8px;display:flex;align-items:center;justify-content:center;transition:color .2s}
      .theme-btn:hover{color:var(--t1)!important}
      @media(max-width:768px){
        .sidebar-d{display:none!important}.topbar-m{display:flex!important}
        .main-wrap{margin-left:0!important;padding:32px 24px!important}
        .card-inner{grid-template-columns:1fr 1fr!important;gap:8px 16px!important}
        .card-due{grid-column:1;grid-row:2}.card-client{grid-column:2;grid-row:1;text-align:right}.card-id{grid-column:1;grid-row:1}
        .card-amt{grid-column:1;grid-row:3}.card-stat{grid-column:2;grid-row:2;justify-self:end}.card-chev{display:none!important}
        .form-inner{padding:32px 24px 140px!important;max-width:100%!important}
        .g2{grid-template-columns:1fr!important}.g3{grid-template-columns:1fr 1fr!important}
        .detail-top{grid-template-columns:1fr!important}.detail-top .sender-addr{text-align:left!important}
        .detail-mid{grid-template-columns:1fr 1fr!important}
        .status-bar{flex-direction:column!important;gap:16px!important;align-items:flex-start!important}
        .d-actions{width:100%;justify-content:center!important}
        .det-body{padding:28px 20px!important}
        .lh{margin-bottom:40px!important}.lh h1{font-size:26px!important}
        .new-lbl{display:none}
        .items-hdr{display:none!important}
        .item-row-d{display:none!important}.item-row-m{display:grid!important}
      }
      @media(max-width:480px){
        .main-wrap{padding:20px 16px!important}
        .g2,.g3{grid-template-columns:1fr!important}
        .detail-mid{grid-template-columns:1fr!important}
        .det-body{padding:20px 16px!important}
        .list-header h1{font-size:22px!important}
      }
    `;
  }, []);
}

/* ─── STATUS BADGE ─── */
function Badge({ status }: { status: "draft" | "pending" | "paid" }): ReactNode {
  const cfg: Record<string, { bg: string; color: string }> = {
    paid:{bg:"rgba(51,214,159,.1)",color:"#33D69F"},
    pending:{bg:"rgba(255,143,0,.1)",color:"#FF8F00"},
    draft:{bg:"rgba(142,147,192,.1)",color:"var(--t2)"},
  };
  const s = cfg[status]||cfg.draft;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,background:s.bg,color:s.color,borderRadius:6,padding:"12px 18px",fontSize:12,fontWeight:700,minWidth:104,justifyContent:"center",fontFamily:"var(--fh)"}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:s.color,flexShrink:0}}/>
      {status.charAt(0).toUpperCase()+status.slice(1)}
    </div>
  );
}

/* ─── FILTER ─── */
function FilterDropdown({ filter, onChange }: { filter: string[]; onChange: (filter: string[]) => void }): ReactNode {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if(ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h as EventListener);
    return () => document.removeEventListener("mousedown", h as EventListener);
  }, []);
  const toggle = (s: string) => onChange(filter.includes(s) ? filter.filter((f: string)=>f!==s) : [...filter, s]);
  const label = filter.length === 0 ? "Filter by status" : `Status: ${filter.join(", ")}`;
  return (
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:10,background:"transparent",border:"none",color:"var(--t1)",fontFamily:"var(--fh)",fontSize:14,fontWeight:700,cursor:"pointer",padding:4}}>
        <span style={{whiteSpace:"nowrap"}}>{label}</span>
        <ChevronDown size={10} color="var(--accent)" style={{transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}/>
      </button>
      {open && (
        <div style={{position:"absolute",top:"calc(100% + 12px)",left:"50%",transform:"translateX(-50%)",background:"var(--surf)",borderRadius:8,boxShadow:"var(--shd)",padding:24,minWidth:192,animation:"scaleIn .15s ease",zIndex:999}}>
          {["draft","pending","paid"].map((s,i) => (
            <div key={s} onClick={()=>toggle(s)} className="filter-opt" style={{display:"flex",alignItems:"center",gap:13,padding:"4px 0",fontSize:14,fontWeight:700,color:"var(--t1)",marginBottom:i<2?16:0,fontFamily:"var(--fh)"}}>
              <div style={{width:16,height:16,borderRadius:2,background:filter.includes(s)?"var(--accent)":"var(--elev)",border:`1px solid ${filter.includes(s)?"var(--accent)":"var(--bdr)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .15s,border-color .15s"}}>
                {filter.includes(s) && <Check size={10} color="white" strokeWidth={3}/>}
              </div>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SIDEBAR ─── */
function Sidebar({ dark, onToggle }: { dark: boolean; onToggle: () => void }): ReactNode {
  return (
    <nav className="sidebar-d" style={{width:103,background:"var(--sbg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",position:"fixed",left:0,top:0,bottom:0,zIndex:100,borderRadius:"0 20px 20px 0",overflow:"hidden"}}>
      <div style={{width:103,height:103,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"50%",background:"var(--accent-h)",borderRadius:"20px 0 0 0"}}/>
        <svg width="28" height="26" viewBox="0 0 28 26" fill="none" style={{position:"relative",zIndex:1}}>
          <path fillRule="evenodd" clipRule="evenodd" d="M20.513 0L28 12.958 20.481 26H7.487L0 12.958 7.487 0h13.026z" fill="white" fillOpacity=".3"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M20.513 0L28 12.958 20.481 26H14.5l7.487-13.042L14.5 0h6.013z" fill="white"/>
        </svg>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
        <button className="theme-btn" onClick={onToggle} style={{color:"var(--t3)",padding:"24px 0",width:"100%"}} aria-label="Toggle theme">
          {dark ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
        <div style={{width:"100%",height:88,borderTop:"1px solid rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:"var(--accent)",border:"2px solid rgba(255,255,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"white",fontFamily:"var(--fh)"}}>U</div>
        </div>
      </div>
    </nav>
  );
}

/* ─── TOP BAR (MOBILE) ─── */
function TopBar({ dark, onToggle }: { dark: boolean; onToggle: () => void }): ReactNode {
  return (
    <nav className="topbar-m" style={{display:"none",background:"var(--sbg)",padding:"0 24px",height:72,alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <div style={{width:72,height:72,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"50%",background:"var(--accent-h)",borderRadius:"15px 0 0 0"}}/>
        <svg width="22" height="20" viewBox="0 0 28 26" fill="none" style={{position:"relative",zIndex:1}}>
          <path fillRule="evenodd" clipRule="evenodd" d="M20.513 0L28 12.958 20.481 26H7.487L0 12.958 7.487 0h13.026z" fill="white" fillOpacity=".3"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M20.513 0L28 12.958 20.481 26H14.5l7.487-13.042L14.5 0h6.013z" fill="white"/>
        </svg>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:24}}>
        <button className="theme-btn" onClick={onToggle} style={{color:"var(--t3)"}} aria-label="Toggle theme">
          {dark ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
        <div style={{width:32,height:32,borderRadius:"50%",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"white",fontFamily:"var(--fh)"}}>U</div>
      </div>
    </nav>
  );
}

/* ─── EMPTY STATE ─── */
function EmptyState(): ReactNode {
  return (
    <div className="fadeUp" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px",textAlign:"center"}}>
      <svg width="200" height="160" viewBox="0 0 200 160" fill="none" style={{marginBottom:40}}>
        <circle cx="100" cy="80" r="70" fill="var(--elev)"/>
        <rect x="62" y="46" width="76" height="68" rx="8" fill="var(--accent)" opacity=".2"/>
        <rect x="70" y="60" width="60" height="7" rx="3.5" fill="var(--accent)" opacity=".4"/>
        <rect x="70" y="74" width="42" height="7" rx="3.5" fill="var(--accent)" opacity=".3"/>
        <rect x="70" y="88" width="52" height="7" rx="3.5" fill="var(--accent)" opacity=".25"/>
        <circle cx="100" cy="80" r="28" fill="var(--surf)" opacity=".95"/>
        <line x1="100" y1="67" x2="100" y2="93" stroke="var(--t3)" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="87" y1="80" x2="113" y2="80" stroke="var(--t3)" strokeWidth="3.5" strokeLinecap="round"/>
      </svg>
      <h2 style={{fontFamily:"var(--fh)",fontSize:20,fontWeight:700,color:"var(--t1)",marginBottom:12}}>Nothing to show</h2>
      <p style={{fontSize:13,color:"var(--t2)",maxWidth:216,lineHeight:1.85}}>
        Create an invoice by clicking the <strong style={{fontFamily:"var(--fh)",color:"var(--t1)"}}>New Invoice</strong> button and get started.
      </p>
    </div>
  );
}

/* ─── INVOICE LIST ─── */
function InvoiceList({ invoices, filter, onFilter, onView, onCreate }: { 
  invoices: Invoice[]; 
  filter: string[]; 
  onFilter: (f: string[]) => void; 
  onView: (id: string) => void; 
  onCreate: () => void;
}): ReactNode {
  const filtered = filter.length === 0 ? invoices : invoices.filter(i => filter.includes(i.status));
  return (
    <div>
      <div className="lh" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:64}}>
        <div>
          <h1 style={{fontFamily:"var(--fh)",fontSize:36,fontWeight:800,color:"var(--t1)",letterSpacing:"-1.5px",lineHeight:1}}>Invoices</h1>
          <p style={{fontSize:13,color:"var(--t2)",marginTop:6}}>
            {filtered.length === 0 ? "No invoices" : `${filtered.length} invoice${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <FilterDropdown filter={filter} onChange={onFilter}/>
          <button onClick={onCreate} className="btn btn-primary" style={{display:"flex",alignItems:"center",gap:16,padding:"8px 16px 8px 8px",borderRadius:24}} aria-label="New Invoice">
            <div style={{width:32,height:32,background:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Plus size={14} color="var(--accent)" strokeWidth={3}/>
            </div>
            <span className="new-lbl">New Invoice</span>
          </button>
        </div>
      </div>
      {filtered.length === 0 ? <EmptyState/> : (
        <div style={{display:"flex",flexDirection:"column",gap:16}} role="list">
          {filtered.map((inv, i) => (
            <div key={inv.id} className="inv-card" role="listitem" onClick={()=>onView(inv.id)}
              tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")onView(inv.id);}}
              style={{background:"var(--surf)",borderRadius:8,padding:"26px 32px",cursor:"pointer",border:"1px solid transparent",animation:`fadeUp .4s ease ${i*50}ms both`,outline:"none"}}
              aria-label={`Invoice ${inv.id}, ${inv.clientName}, ${fmt(inv.total)}, ${inv.status}`}
            >
              <div className="card-inner" style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto auto auto",alignItems:"center",gap:"0 20px",width:"100%"}}>
                <span className="card-id" style={{fontFamily:"var(--fm)",fontSize:12,fontWeight:700,color:"var(--t1)",marginRight:4}}>
                  <span style={{color:"var(--t3)"}}>#</span>{inv.id}
                </span>
                <span className="card-due" style={{fontSize:13,color:"var(--t2)",gridColumn:2}}>
                  Due {fmtDate(inv.paymentDue)}
                </span>
                <span className="card-client" style={{fontSize:13,color:"var(--t2)",gridColumn:3}}>
                  {inv.clientName}
                </span>
                <span className="card-amt" style={{fontFamily:"var(--fm)",fontSize:16,fontWeight:700,color:"var(--t1)",textAlign:"right",gridColumn:4}}>
                  {fmt(inv.total)}
                </span>
                <div className="card-stat" style={{gridColumn:5}}><Badge status={inv.status}/></div>
                <ChevronRight className="card-chev" size={10} color="var(--accent)" style={{gridColumn:6}}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── INVOICE DETAIL ─── */
function InvoiceDetail({ invoice, onBack, onEdit, onDelete, onMarkPaid }: { 
  invoice: Invoice; 
  onBack: () => void; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void; 
  onMarkPaid: (id: string) => void;
}): ReactNode {
  return (
    <div className="fadeUp">
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:24,background:"transparent",border:"none",fontFamily:"var(--fh)",fontSize:14,fontWeight:700,color:"var(--t1)",cursor:"pointer",padding:0,marginBottom:32,transition:"color .2s",outline:"none"}}
        onMouseEnter={e=>e.currentTarget.style.color="var(--accent)"}
        onMouseLeave={e=>e.currentTarget.style.color="var(--t1)"}
        onFocus={e=>e.currentTarget.style.color="var(--accent)"}
        onBlur={e=>e.currentTarget.style.color="var(--t1)"}
      >
        <ArrowLeft size={10} color="var(--accent)"/> Go back
      </button>

      <div className="status-bar" style={{background:"var(--surf)",borderRadius:8,padding:"20px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontSize:13,color:"var(--t2)"}}>Status</span>
          <Badge status={invoice.status}/>
        </div>
        <div className="d-actions" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {invoice.status !== "paid" && (
            <button onClick={()=>onEdit(invoice.id)} className="btn btn-soft">Edit</button>
          )}
          <button onClick={()=>onDelete(invoice.id)} className="btn btn-danger">Delete</button>
          {invoice.status === "pending" && (
            <button onClick={()=>onMarkPaid(invoice.id)} className="btn btn-primary">Mark as Paid</button>
          )}
          {invoice.status === "draft" && (
            <button onClick={()=>onMarkPaid(invoice.id)} className="btn btn-primary">Send Invoice</button>
          )}
        </div>
      </div>

      <div className="det-body" style={{background:"var(--surf)",borderRadius:8,padding:48}}>
        <div className="detail-top" style={{display:"grid",gridTemplateColumns:"1fr 1fr",marginBottom:48,gap:24}}>
          <div>
            <div style={{fontFamily:"var(--fm)",fontSize:16,fontWeight:700,color:"var(--t1)"}}>
              <span style={{color:"var(--t3)"}}>#</span>{invoice.id}
            </div>
            <div style={{fontSize:13,color:"var(--t2)",marginTop:6}}>{invoice.description}</div>
          </div>
          <div className="sender-addr" style={{textAlign:"right",fontSize:11,color:"var(--t2)",lineHeight:2}}>
            <div>{invoice.senderAddress.street}</div>
            <div>{invoice.senderAddress.city}</div>
            <div>{invoice.senderAddress.postCode}</div>
            <div>{invoice.senderAddress.country}</div>
          </div>
        </div>

        <div className="detail-mid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:32,marginBottom:48}}>
          <div>
            <div style={{fontSize:12,color:"var(--t2)",marginBottom:12}}>Invoice Date</div>
            <div style={{fontSize:15,fontWeight:700,color:"var(--t1)",fontFamily:"var(--fh)"}}>{fmtDate(invoice.createdAt)}</div>
            <div style={{fontSize:12,color:"var(--t2)",marginTop:28,marginBottom:12}}>Payment Due</div>
            <div style={{fontSize:15,fontWeight:700,color:"var(--t1)",fontFamily:"var(--fh)"}}>{fmtDate(invoice.paymentDue)}</div>
          </div>
          <div>
            <div style={{fontSize:12,color:"var(--t2)",marginBottom:12}}>Bill To</div>
            <div style={{fontSize:15,fontWeight:700,color:"var(--t1)",fontFamily:"var(--fh)",marginBottom:8}}>{invoice.clientName}</div>
            <div style={{fontSize:11,color:"var(--t2)",lineHeight:2}}>
              <div>{invoice.clientAddress.street}</div>
              <div>{invoice.clientAddress.city}</div>
              <div>{invoice.clientAddress.postCode}</div>
              <div>{invoice.clientAddress.country}</div>
            </div>
          </div>
          <div>
            <div style={{fontSize:12,color:"var(--t2)",marginBottom:12}}>Sent To</div>
            <div style={{fontSize:15,fontWeight:700,color:"var(--t1)",fontFamily:"var(--fh)",wordBreak:"break-all"}}>{invoice.clientEmail}</div>
          </div>
        </div>

        <div style={{borderRadius:"8px 8px 0 0",overflow:"hidden"}}>
          <div className="items-hdr" style={{display:"grid",gridTemplateColumns:"1fr 60px 100px 100px",gap:16,padding:"24px 32px",fontSize:11,color:"var(--t2)",background:"var(--elev)"}}>
            <span>Item Name</span>
            <span style={{textAlign:"center"}}>QTY.</span>
            <span style={{textAlign:"right"}}>Price</span>
            <span style={{textAlign:"right"}}>Total</span>
          </div>
          <div style={{background:"var(--elev)"}}>
            {invoice.items.map(item => (
              <div key={item.id} style={{display:"grid",gridTemplateColumns:"1fr 60px 100px 100px",gap:16,padding:"16px 32px",alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:700,color:"var(--t1)",fontFamily:"var(--fh)"}}>{item.name}</span>
                <span style={{fontSize:13,fontWeight:700,color:"var(--t2)",textAlign:"center",fontFamily:"var(--fm)"}}>{item.quantity}</span>
                <span style={{fontSize:13,fontWeight:700,color:"var(--t2)",textAlign:"right",fontFamily:"var(--fm)"}}>{fmt(item.price)}</span>
                <span style={{fontSize:13,fontWeight:700,color:"var(--t1)",textAlign:"right",fontFamily:"var(--fm)"}}>{fmt(item.quantity*item.price)}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"var(--total-bg)",borderRadius:"0 0 8px 8px",padding:"24px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",color:"white"}}>
          <span style={{fontSize:13}}>Grand Total</span>
          <span style={{fontFamily:"var(--fm)",fontSize:24,fontWeight:700}}>{fmt(invoice.total)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── DELETE MODAL ─── */
function DeleteModal({ invoiceId, onConfirm, onCancel }: { 
  invoiceId: string; 
  onConfirm: () => void; 
  onCancel: () => void;
}): ReactNode {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const h = (e: KeyboardEvent) => { if(e.key==="Escape") onCancel(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="del-title" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"fadeInBg .2s ease"}}>
      <div style={{background:"var(--surf)",borderRadius:8,padding:48,maxWidth:480,width:"100%",animation:"scaleIn .2s ease"}}>
        <h2 id="del-title" style={{fontFamily:"var(--fh)",fontSize:24,fontWeight:800,color:"var(--t1)",marginBottom:14}}>Confirm Deletion</h2>
        <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.85,marginBottom:24}}>
          Are you sure you want to delete invoice <strong style={{fontFamily:"var(--fm)",color:"var(--t1)"}}>#{invoiceId}</strong>? This action cannot be undone.
        </p>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button ref={cancelRef} onClick={onCancel} className="btn btn-soft">Cancel</button>
          <button onClick={onConfirm} className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── FORM VALIDATION ─── */
function validate(data: FormData): Record<string, string> {
  const e: Record<string, string> = {};
  if (!data.senderStreet.trim()) e.senderStreet = "required";
  if (!data.senderCity.trim()) e.senderCity = "required";
  if (!data.senderPostCode.trim()) e.senderPostCode = "required";
  if (!data.senderCountry.trim()) e.senderCountry = "required";
  if (!data.clientName.trim()) e.clientName = "required";
  if (!data.clientEmail.trim()) e.clientEmail = "required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) e.clientEmail = "invalid email";
  if (!data.clientStreet.trim()) e.clientStreet = "required";
  if (!data.clientCity.trim()) e.clientCity = "required";
  if (!data.clientPostCode.trim()) e.clientPostCode = "required";
  if (!data.clientCountry.trim()) e.clientCountry = "required";
  if (!data.description.trim()) e.description = "required";
  if (data.items.length === 0) e.items = "Add at least one item";
  data.items.forEach((it, i) => {
    if (!it.name.trim()) e[`iname${i}`] = "required";
    if (Number(it.quantity) < 1) e[`iqty${i}`] = ">0";
    if (Number(it.price) < 0) e[`ipr${i}`] = "≥0";
  });
  return e;
}

/* ─── INVOICE FORM ─── */
function InvoiceForm({ invoice, onClose, onSave }: { 
  invoice: Invoice | null; 
  onClose: () => void; 
  onSave: (inv: Invoice, isEdit: boolean) => void;
}): ReactNode {
  const init: FormData = invoice ? {
    senderStreet:invoice.senderAddress.street, senderCity:invoice.senderAddress.city,
    senderPostCode:invoice.senderAddress.postCode, senderCountry:invoice.senderAddress.country,
    clientName:invoice.clientName, clientEmail:invoice.clientEmail,
    clientStreet:invoice.clientAddress.street, clientCity:invoice.clientAddress.city,
    clientPostCode:invoice.clientAddress.postCode, clientCountry:invoice.clientAddress.country,
    createdAt:invoice.createdAt, paymentTerms:invoice.paymentTerms, description:invoice.description,
    items:invoice.items.map(i=>({...i}))
  } : {
    senderStreet:"", senderCity:"", senderPostCode:"", senderCountry:"",
    clientName:"", clientEmail:"", clientStreet:"", clientCity:"", clientPostCode:"", clientCountry:"",
    createdAt:todayStr(), paymentTerms:30, description:"",
    items:[{id:"new0",name:"",quantity:1,price:0,total:0}]
  };

  const [data, setData] = useState<FormData>(init);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [tried, setTried] = useState(false);

  const set = (k: keyof FormData, v: any) => {
    setData(d=>({...d,[k]:v}));
    if (tried) setErrs(e=>{const n={...e};delete (n as any)[k];return n;});
  };
  const setItem = (idx: number, k: keyof InvoiceItem, v: any) => {
    setData(d=>({...d, items:d.items.map((it,i)=>i===idx?{...it,[k]:v}:it)}));
    if (tried) setErrs(e=>{const n={...e};delete (n as any)[`i${k[0]}${k==="name"?"name":k}${idx}`];return n;});
  };
  const addItem = () => setData(d=>({...d, items:[...d.items,{id:`new${Date.now()}`,name:"",quantity:1,price:0,total:0}]}));
  const removeItem = (idx: number) => setData(d=>({...d, items:d.items.filter((_,i)=>i!==idx)}));

  const handleSave = (asDraft: boolean) => {
    setTried(true);
    const errors = asDraft ? {} : validate(data);
    if (!asDraft && Object.keys(errors).length > 0) { setErrs(errors); return; }
    const total = data.items.reduce((s,it)=>s+parseFloat(it.price as any||0)*parseInt(it.quantity as any||0,10),0);
    const inv: Invoice = {
      id: invoice ? invoice.id : uid(),
      createdAt: data.createdAt,
      paymentDue: addDays(data.createdAt, parseInt(data.paymentTerms as string,10)),
      description: data.description,
      paymentTerms: parseInt(data.paymentTerms as string,10),
      clientName: data.clientName, clientEmail: data.clientEmail,
      status: asDraft ? "draft" : (invoice ? (invoice.status==="draft"?"pending":invoice.status) : "pending"),
      senderAddress:{street:data.senderStreet,city:data.senderCity,postCode:data.senderPostCode,country:data.senderCountry},
      clientAddress:{street:data.clientStreet,city:data.clientCity,postCode:data.clientPostCode,country:data.clientCountry},
      items: data.items.map((it,i)=>({id:it.id||`it${i}`,name:it.name,quantity:parseInt(it.quantity as any,10),price:parseFloat(it.price as any),total:parseFloat(it.price as any)*parseInt(it.quantity as any,10)})),
      total
    };
    onSave(inv, !!invoice);
  };

  useEffect(()=>{ document.body.style.overflow="hidden"; return()=>{document.body.style.overflow="";}; },[]);

  const hasErrs = Object.keys(errs).length > 0;

  const Lbl = ({for: f, txt, err, style: s}: {for: string; txt: string; err?: string; style?: Record<string, any>}): ReactNode => (
    <label htmlFor={f} style={{fontSize:12,fontWeight:500,display:"flex",justifyContent:"space-between",color:err?"var(--danger)":"var(--t2)",marginBottom:10,...s}}>
      {txt}{err&&<span style={{fontSize:10,color:"var(--danger)"}}>{err}</span>}
    </label>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",animation:"fadeInBg .2s ease"}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}
    >
      <div style={{width:103,flexShrink:0}} className="sidebar-d"/>
      <div className="form-inner" style={{background:"var(--bg)",width:"100%",maxWidth:616,height:"100vh",overflowY:"auto",padding:"56px 56px 160px",animation:"slideIn .35s cubic-bezier(.25,.46,.45,.94)"}}>
        <h1 style={{fontFamily:"var(--fh)",fontSize:24,fontWeight:800,color:"var(--t1)",marginBottom:48}}>
          {invoice ? <><span style={{color:"var(--t3)"}}>Edit #</span>{invoice.id}</> : "New Invoice"}
        </h1>

        {hasErrs && tried && (
          <div style={{background:"rgba(236,87,87,.1)",border:"1px solid var(--danger)",borderRadius:4,padding:"12px 16px",marginBottom:24,fontSize:12,color:"var(--danger)",fontWeight:700,fontFamily:"var(--fh)"}}>
            — All fields marked required must be completed<br/>
            — Each item needs a name, quantity ≥ 1, price ≥ 0
          </div>
        )}

        {/* BILL FROM */}
        <p style={{fontSize:12,fontWeight:700,color:"var(--accent)",letterSpacing:".5px",textTransform:"uppercase",marginBottom:24,fontFamily:"var(--fh)"}}>Bill From</p>
        <div style={{marginBottom:24}}>
          <Lbl for="ss" txt="Street Address" err={(errs as any).senderStreet}/>
          <input id="ss" className={`inp${(errs as any).senderStreet?" err":""}`} value={data.senderStreet} onChange={e=>set("senderStreet",e.target.value)} autoComplete="street-address"/>
        </div>
        <div className="g3" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:24,marginBottom:32}}>
          <div><Lbl for="sc" txt="City" err={(errs as any).senderCity}/><input id="sc" className={`inp${(errs as any).senderCity?" err":""}`} value={data.senderCity} onChange={e=>set("senderCity",e.target.value)}/></div>
          <div><Lbl for="sp" txt="Post Code" err={(errs as any).senderPostCode}/><input id="sp" className={`inp${(errs as any).senderPostCode?" err":""}`} value={data.senderPostCode} onChange={e=>set("senderPostCode",e.target.value)}/></div>
          <div><Lbl for="sco" txt="Country" err={(errs as any).senderCountry}/><input id="sco" className={`inp${(errs as any).senderCountry?" err":""}`} value={data.senderCountry} onChange={e=>set("senderCountry",e.target.value)}/></div>
        </div>

        <div style={{height:1,background:"var(--bdr)",margin:"0 0 32px"}}/>

        {/* BILL TO */}
        <p style={{fontSize:12,fontWeight:700,color:"var(--accent)",letterSpacing:".5px",textTransform:"uppercase",marginBottom:24,fontFamily:"var(--fh)"}}>Bill To</p>
        <div style={{marginBottom:24}}>
          <Lbl for="cn" txt="Client's Name" err={(errs as any).clientName}/>
          <input id="cn" className={`inp${(errs as any).clientName?" err":""}`} value={data.clientName} onChange={e=>set("clientName",e.target.value)} autoComplete="name"/>
        </div>
        <div style={{marginBottom:24}}>
          <Lbl for="ce" txt="Client's Email" err={(errs as any).clientEmail}/>
          <input id="ce" type="email" placeholder="e.g. email@example.com" className={`inp${(errs as any).clientEmail?" err":""}`} value={data.clientEmail} onChange={e=>set("clientEmail",e.target.value)} autoComplete="email"/>
        </div>
        <div style={{marginBottom:24}}>
          <Lbl for="cst" txt="Street Address" err={(errs as any).clientStreet}/>
          <input id="cst" className={`inp${(errs as any).clientStreet?" err":""}`} value={data.clientStreet} onChange={e=>set("clientStreet",e.target.value)}/>
        </div>
        <div className="g3" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:24,marginBottom:32}}>
          <div><Lbl for="cc" txt="City" err={(errs as any).clientCity}/><input id="cc" className={`inp${(errs as any).clientCity?" err":""}`} value={data.clientCity} onChange={e=>set("clientCity",e.target.value)}/></div>
          <div><Lbl for="cpco" txt="Post Code" err={(errs as any).clientPostCode}/><input id="cpco" className={`inp${(errs as any).clientPostCode?" err":""}`} value={data.clientPostCode} onChange={e=>set("clientPostCode",e.target.value)}/></div>
          <div><Lbl for="ccou" txt="Country" err={(errs as any).clientCountry}/><input id="ccou" className={`inp${(errs as any).clientCountry?" err":""}`} value={data.clientCountry} onChange={e=>set("clientCountry",e.target.value)}/></div>
        </div>

        <div style={{height:1,background:"var(--bdr)",margin:"0 0 32px"}}/>

        {/* INVOICE META */}
        <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
          <div>
            <Lbl for="idate" txt="Invoice Date"/>
            <input id="idate" type="date" className="inp" value={data.createdAt} onChange={e=>set("createdAt",e.target.value)}/>
          </div>
          <div>
            <Lbl for="pterms" txt="Payment Terms"/>
            <select id="pterms" className="inp sel" value={data.paymentTerms} onChange={e=>set("paymentTerms",e.target.value)}>
              <option value={1}>Net 1 Day</option>
              <option value={7}>Net 7 Days</option>
              <option value={14}>Net 14 Days</option>
              <option value={30}>Net 30 Days</option>
            </select>
          </div>
        </div>
        <div style={{marginBottom:40}}>
          <Lbl for="desc" txt="Project Description" err={(errs as any).description}/>
          <input id="desc" placeholder="e.g. Graphic Design Service" className={`inp${(errs as any).description?" err":""}`} value={data.description} onChange={e=>set("description",e.target.value)}/>
        </div>

        {/* ITEM LIST */}
        <h3 style={{fontFamily:"var(--fh)",fontSize:18,fontWeight:700,color:(errs as any).items?"var(--danger)":"var(--t2)",marginBottom:16}}>
          Item List {(errs as any).items && <span style={{fontSize:12,fontWeight:500}}> — {(errs as any).items}</span>}
        </h3>

        {/* Desktop header */}
        <div className="items-hdr" style={{display:"grid",gridTemplateColumns:"1fr 64px 104px 92px 28px",gap:16,fontSize:11,color:"var(--t2)",marginBottom:12,padding:"0 4px"}}>
          <span>Item Name</span><span style={{textAlign:"center"}}>Qty</span><span style={{textAlign:"right"}}>Price</span><span style={{textAlign:"right"}}>Total</span><span/>
        </div>

        {data.items.map((item, idx) => (
          <div key={item.id}>
            {/* Desktop Row */}
            <div className="item-row-d" style={{display:"grid",gridTemplateColumns:"1fr 64px 104px 92px 28px",gap:16,alignItems:"center",marginBottom:18}}>
              <input aria-label="Item name" placeholder="Item name" className={`inp${(errs as any)[`iname${idx}`]?" err":""}`} value={item.name} onChange={e=>setItem(idx,"name",e.target.value)}/>
              <input aria-label="Quantity" type="number" min="1" className={`inp${(errs as any)[`iqty${idx}`]?" err":""}`} value={item.quantity} onChange={e=>setItem(idx,"quantity",e.target.value)} style={{textAlign:"center",paddingLeft:8,paddingRight:8}}/>
              <input aria-label="Price" type="number" min="0" step="0.01" className={`inp${(errs as any)[`ipr${idx}`]?" err":""}`} value={item.price} onChange={e=>setItem(idx,"price",e.target.value)} style={{textAlign:"right"}}/>
              <div style={{fontFamily:"var(--fm)",fontSize:13,fontWeight:700,color:"var(--t2)",textAlign:"right",paddingRight:4}}>
                {fmt(parseFloat(item.price as any||0)*parseInt(item.quantity as any||0,10))}
              </div>
              <button onClick={()=>removeItem(idx)} aria-label="Remove item" style={{background:"transparent",border:"none",color:"var(--t2)",cursor:"pointer",padding:4,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:4,transition:"color .2s"}}
                onMouseEnter={e=>e.currentTarget.style.color="var(--danger)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--t2)"}
              ><Trash2 size={15}/></button>
            </div>
            {/* Mobile Row */}
            <div className="item-row-m" style={{display:"none",gridTemplateColumns:"1fr 1fr",gap:16,background:"var(--elev)",borderRadius:8,padding:16,marginBottom:16,position:"relative"}}>
              <div style={{gridColumn:"1/-1"}}>
                <label style={{fontSize:11,color:"var(--t2)",display:"block",marginBottom:8}}>Item Name</label>
                <input placeholder="Item name" className={`inp${(errs as any)[`iname${idx}`]?" err":""}`} value={item.name} onChange={e=>setItem(idx,"name",e.target.value)}/>
              </div>
              <div>
                <label style={{fontSize:11,color:"var(--t2)",display:"block",marginBottom:8}}>Qty</label>
                <input type="number" min="1" className={`inp${(errs as any)[`iqty${idx}`]?" err":""}`} value={item.quantity} onChange={e=>setItem(idx,"quantity",e.target.value)}/>
              </div>
              <div>
                <label style={{fontSize:11,color:"var(--t2)",display:"block",marginBottom:8}}>Price</label>
                <input type="number" min="0" step="0.01" className={`inp${(errs as any)[`ipr${idx}`]?" err":""}`} value={item.price} onChange={e=>setItem(idx,"price",e.target.value)}/>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gridColumn:"1/-1",paddingTop:4}}>
                <div>
                  <div style={{fontSize:11,color:"var(--t2)",marginBottom:4}}>Total</div>
                  <span style={{fontFamily:"var(--fm)",fontSize:13,fontWeight:700,color:"var(--t2)"}}>{fmt(parseFloat(item.price as any||0)*parseInt(item.quantity as any||0,10))}</span>
                </div>
                <button onClick={()=>removeItem(idx)} aria-label="Remove item" style={{background:"transparent",border:"none",color:"var(--t2)",cursor:"pointer",padding:8,transition:"color .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--danger)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--t2)"}
                ><Trash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}

        <button onClick={addItem} style={{width:"100%",background:"var(--elev)",border:"none",borderRadius:24,padding:18,fontFamily:"var(--fh)",fontSize:14,fontWeight:700,color:"var(--t2)",cursor:"pointer",marginTop:8,transition:"background .2s,color .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--bdr)";e.currentTarget.style.color="var(--t1)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="var(--elev)";e.currentTarget.style.color="var(--t2)";}}
        >+ Add New Item</button>

        {/* FOOTER */}
        <div style={{position:"sticky",bottom:0,background:"linear-gradient(to top, var(--bg) 70%, transparent)",paddingTop:32,paddingBottom:24,marginTop:40,display:"flex",gap:8,justifyContent:"flex-end",flexWrap:"wrap"}}>
          {!invoice ? (
            <>
              <button onClick={onClose} className="btn btn-soft">Discard</button>
              <button onClick={()=>handleSave(true)} className="btn btn-dark">Save as Draft</button>
              <button onClick={()=>handleSave(false)} className="btn btn-primary">Save & Send</button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="btn btn-soft">Cancel</button>
              <button onClick={()=>handleSave(invoice.status==="draft")} className="btn btn-primary">Save Changes</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT APP ─── */
export default function App(): ReactNode {
  const [dark, setDark] = useState<boolean>(true);
  const [invoices, setInvoices] = useState<Invoice[]>(SAMPLES);
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useGlobalStyles();

  /* Apply theme to document */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  /* Load from persistent storage */
  useEffect(() => {
    const load = async () => {
      try {
        const si = localStorage.getItem("inv_data");
        if (si) setInvoices(JSON.parse(si) as Invoice[]);
        const th = localStorage.getItem("inv_theme");
        if (th) setDark(th === "dark");
      } catch(_) {}
      setLoaded(true);
    };
    load();
  }, []);

  /* Save invoices */
  useEffect(() => {
    if (!loaded) return;
    const save = async () => {
      try { localStorage.setItem("inv_data", JSON.stringify(invoices)); } catch(_) {}
    };
    save();
  }, [invoices, loaded]);

  /* Save theme */
  useEffect(() => {
    if (!loaded) return;
    const save = async () => {
      try { localStorage.setItem("inv_theme", dark ? "dark" : "light"); } catch(_) {}
    };
    save();
  }, [dark, loaded]);

  const selectedInvoice: Invoice | undefined = invoices.find(i => i.id === selectedId);
  const editingInvoice: Invoice | undefined = editingId ? invoices.find(i => i.id === editingId) : undefined;

  const handleSave = (inv: Invoice, isEdit: boolean) => {
    if (isEdit) setInvoices(p => p.map(i => i.id === inv.id ? inv : i));
    else setInvoices(p => [inv, ...p]);
    setShowForm(false);
    setEditingId(null);
    if (isEdit && selectedId) setSelectedId(inv.id);
  };

  const handleDelete = (id: string) => {
    setInvoices(p => p.filter(i => i.id !== id));
    setDeleteId(null);
    setView("list");
    setSelectedId(null);
  };

  const handleMarkPaid = (id: string) => {
    setInvoices(p => p.map(i => i.id === id
      ? {...i, status: i.status === "draft" ? "pending" : "paid"} : i));
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--t1)"}}>
      <Sidebar dark={dark} onToggle={()=>setDark(d=>!d)}/>
      <TopBar dark={dark} onToggle={()=>setDark(d=>!d)}/>
      <main className="main-wrap" style={{marginLeft:103,padding:"72px 48px",maxWidth:900}}>
        {view === "list" && (
          <InvoiceList
            invoices={invoices}
            filter={filter}
            onFilter={setFilter}
            onView={id=>{ setSelectedId(id); setView("detail"); }}
            onCreate={()=>{ setEditingId(null); setShowForm(true); }}
          />
        )}
        {view === "detail" && selectedInvoice && (
          <InvoiceDetail
            invoice={selectedInvoice}
            onBack={()=>setView("list")}
            onEdit={id=>{ setEditingId(id); setShowForm(true); }}
            onDelete={id=>setDeleteId(id)}
            onMarkPaid={handleMarkPaid}
          />
        )}
        {view === "detail" && !selectedInvoice && (
          <div style={{textAlign:"center",paddingTop:80}}>
            <p style={{color:"var(--t2)"}}>Invoice not found.</p>
            <button onClick={()=>setView("list")} className="btn btn-primary" style={{marginTop:24}}>Back to Invoices</button>
          </div>
        )}
      </main>

      {showForm && (
        <InvoiceForm
          invoice={editingInvoice || null}
          onClose={()=>{ setShowForm(false); setEditingId(null); }}
          onSave={handleSave}
        />
      )}

      {deleteId && (
        <DeleteModal
          invoiceId={deleteId}
          onConfirm={()=>handleDelete(deleteId)}
          onCancel={()=>setDeleteId(null)}
        />
      )}
    </div>
  );
}
