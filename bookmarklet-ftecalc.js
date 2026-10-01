javascript:(function(){
    /* FTECalc: teaching FTE and student credit hours (SCH) for an academic year, from the UW Time Schedule.
       Run it on any Time Schedule quarter page (e.g. /students/timeschd/AUT2026/). It reads the Autumn, Winter and Spring
       pages of the course prefixes you choose (Summer is never counted) and opens a dashboard: a summary, programs
       compared, each instructor's load, and TA allocation. It reads only the Time Schedule's section listings, so no
       student data; TA names become TA1, TA2... as pages load. Categories, loads and budgets you set stay in this browser.
       The prefix list and the way section lines are read follow Ben Marwick's Time Schedule tools (MIT license; see
       LICENSE), as do several ideas: splitting co-taught sections, the CAS minimum-enrollment warning, how evenly an
       instructor's SCH is spread, and how concentrated a program's SCH is. Design notes are in the README. */
    /* Each course prefix and its Time Schedule page, from Ben Marwick's Time Schedule tools. */
    var PREFIXES = {"A A":"aa.html","A E":"ae.html","A S":"88aerosci.html","AAS":"asamst.html","ACADEM":"academ.html","ACCTG":"acctg.html","ADMIN":"admin.html","AES":"aes.html","AFRAM":"afamst.html","AIS":"ais.html","AMATH":"appmath.html","AMHAR":"amhar.html","ANEST":"anest.html","ANTH":"anthro.html","ARAB":"arabic.html","ARAMIC":"aramic.html","ARCH":"archit.html","ARCHY":"archeo.html","ARCTIC":"arctic.html","ART":"art.html","ART H":"arthis.html","ARTS":"arts.html","ARTSCI":"artsci.html","ASIAN":"asianll.html","ASL":"asl.html","ASTBIO":"astbio.html","ASTR":"astro.html","ATMOS":"atmoscs.html","B A":"ba.html","B CMU":"buscomm.html","B E":"be.html","B ECON":"busecon.html","B H":"bh.html","B POL":"bpol.html","B STR":"biostruct.html","BA RM":"barm.html","BATY E":"batye.html","BCMS":"bcms.html","BENG":"beng.html","BIBHEB":"bibheb.html","BIME":"bime.html","BIO A":"bioanth.html","BIOC":"bioch.html","BIOEN":"bioeng.html","BIOL":"biology.html","BIOST":"biostat.html","BPSD":"bpsd.html","BULGR":"bulgar.html","BUS AN":"busan.html","C ENV":"cenv.html","C LIT":"complit.html","C MED":"compmed.html","CEE":"cee.html","CEP":"commenv.html","CESG":"cesg.html","CESI":"cesi.html","CET":"cet.html","CEWA":"cewa.html","CFRM":"cfrm.html","CHEM":"chem.html","CHEM E":"cheng.html","CHGTAI":"chgtai.html","CHID":"chid.html","CHIN":"chinese.html","CHSTU":"chist.html","CL AR":"clarch.html","CL LI":"cling.html","CLAS":"clas.html","CM":"constmgmt.html","CMS":"cms.html","COM":"com.html","COMMLD":"commld.html","CONJ":"conj.html","COPTIC":"coptic.html","CS&SS":"cs&ss.html","CSDE":"csde.html","CSE":"cse.html","CSE D":"csed.html","CZECH":"czech.html","D HYG":"denthy.html","DANCE":"dance.html","DANISH":"danish.html","DATA":"data.html","DENT":"dent.html","DENTCL":"dentcl.html","DENTEL":"dentel.html","DENTFN":"dentfn.html","DENTGP":"dentgp.html","DENTPC":"dentpc.html","DENTSL":"dentsl.html","DERM":"derm.html","DESIGN":"design.html","DIS ST":"disst.html","DPHS":"dphs.html","DRAMA":"drama.html","DXARTS":"dxarts.html","E E":"ee.html","EBIZ":"ebiz.html","ECE":"ece.html","ECFS":"ecfs.html","ECON":"econ.html","EDC&I":"edci.html","EDLPS":"edlp.html","EDPSY":"edpsy.html","EDSPE":"sped.html","EDTEP":"teached.html","EDUC":"indsrf.html","EGYPT":"egypt.html","ENDO":"endo.html","ENGL":"engl.html","ENGR":"engr.html","ENTRE":"entre.html","ENV H":"envh.html","ENVIR":"envst.html","EPI":"epidem.html","ESMS":"esms.html","ESRM":"esrm.html","ESS":"ess.html","ESTO":"eston.html","ETHICS":"ethics.html","FAMED":"famed.html","FHL":"fhl.html","FIN":"finance.html","FINN":"finnish.html","FISH":"fish.html","FRENCH":"french.html","G H":"gh.html","GCNSL":"gcnsl.html","GEEZ":"geez.html","GEN ST":"genst.html","GENOME":"genome.html","GEOG":"geog.html","GEORG":"georg.html","GERMAN":"germ.html","GIS":"gis.html","GLITS":"glits.html","GRDSCH":"grad.html","GREEK":"greek.html","GWSS":"gwss.html","HCDE":"hcde.html","HCID":"hcid.html","HCSS":"hcss.html","HDD":"hdd.html","HEBR":"hebrew.html","HEOR":"heor.html","HIHIM":"95hihim.html","HINDI":"hindi.html","HMS":"hms.html","HONORS":"hnrs.html","HPS":"hps.html","HRMOB":"hrmob.html","HSERV":"hlthsvcs.html","HSMGMT":"hsmgmt.html","HSTAA":"histam.html","HSTAFM":"hstafm.html","HSTAM":"ancmedh.html","HSTAS":"histasia.html","HSTCMP":"hstcmp.html","HSTEU":"modeuro.html","HSTLAC":"hstlac.html","HSTRY":"hstry.html","HUBIO":"humbio.html","HUM":"centhum.html","I BUS":"intlbus.html","I S":"infosys.html","ICEL":"icel.html","IECMH":"iecmh.html","IMMUN":"immun.html","IMT":"imt.html","IND E":"inde.html","INDIV":"indiv.html","INDN":"indian.html","INDO":"indo.html","INFO":"info.html","INSC":"insc.html","INTSCI":"intsci.html","IPHD":"iphd.html","IPM":"ipm.html","ITAL":"italian.html","JAPAN":"japanese.html","JEW ST":"jewst.html","JSIS":"jsis.html","JSIS A":"jsisa.html","JSIS B":"jsisb.html","JSIS C":"jsisc.html","JSIS D":"jsisd.html","JSIS E":"jsise.html","KAZAKH":"kazakh.html","KHMER":"khmer.html","KOREAN":"korean.html","KYRGYZ":"kyrgyz.html","L ARCH":"landscape.html","LAB M":"labmed.html","LABOR":"labor.html","LADINO":"ladino.html","LATIN":"latin.html","LATV":"latvian.html","LAW":"law.html","LAW A":"lawa.html","LAW B":"lawb.html","LAW C":"lawc.html","LAW E":"lawe.html","LAW H":"lawh.html","LAW P":"lawp.html","LAW T":"lawt.html","LEAD":"lead.html","LING":"ling.html","LIS":"lis.html","LIT":"lit.html","LITH":"lith.html","LSJ":"lsj.html","M E":"meche.html","M SCI":"88milsci.html","MARBIO":"marbio.html","MATH":"math.html","MCB":"mcb.html","MED":"medicine.html","MED EM":"medem.html","MEDCH":"medchem.html","MEDECK":"medeck.html","MEDENG":"medeng.html","MEDLIC":"medlic.html","MEDRCK":"medrck.html","MEDSCI":"medsci.html","MEIE":"meie.html","MELC":"melc.html","MGMT":"mgmt.html","MICROM":"microbio.html","MKTG":"mktg.html","MODHEB":"modheb.html","MOLENG":"moleng.html","MOLMED":"molmed.html","MS E":"mse.html","MSIS":"msis.html","MSTP":"mstp.html","MSW":"socwk.html","MUHST":"mushist.html","MUSAP":"appmus.html","MUSED":"mused.html","MUSEN":"musensem.html","MUSEUM":"museum.html","MUSIC":"music.html","MUSICP":"musicp.html","MUSTEC":"mustec.html","N SCI":"88navsci.html","N&MES":"nearmide.html","NBIO":"nbio.html","NCLIN":"nursingcl.html","NEUBIO":"neubio.html","NEUR S":"neurosurg.html","NEURL":"neurl.html","NEURO":"neuro.html","NEUSCI":"neusci.html","NME":"nme.html","NMETH":"nursingmeth.html","NORW":"norweg.html","NSG":"nsg.html","NURS":"nursing.html","NUTR":"nutrit.html","O E":"orgenv.html","O S":"os.html","OB GYN":"obgyn.html","OCEAN":"ocean.html","OHS":"ohs.html","OPHTH":"ophthal.html","OPMGT":"opmgmt.html","ORALB":"oralbio.html","ORALM":"oralm.html","ORTHO":"orthod.html","ORTHP":"orthop.html","OTOHN":"otol.html","P BIO":"physiolbio.html","PABIO":"pathobio.html","PATH":"patho.html","PBSCI":"psychbehav.html","PCEUT":"pharmceu.html","PEDO":"pedodon.html","PEDS":"pediat.html","PERIO":"perio.html","PHARBE":"pharbe.html","PHARM":"pharmacy.html","PHARMP":"pharmp.html","PHCOL":"pharma.html","PHG":"phg.html","PHI":"phi.html","PHIL":"phil.html","PHRMCY":"phrmcy.html","PHRMPR":"phrmpr.html","PHRMRA":"phrmra.html","PHRMSC":"phrmsc.html","PHYS":"phys.html","POL S":"polisci.html","POLSH":"polish.html","PORT":"port.html","PPM":"ppm.html","PROS":"pros.html","PRSAN":"persian.html","PSYCAP":"95psycap.html","PSYCH":"psych.html","PSYCLN":"psycln.html","PUBPOL":"pubpol.html","PUBSCH":"pubsch.html","Q SCI":"quantsci.html","QERM":"quante.html","QMETH":"qmeth.html","QUAT":"qrc.html","R E":"re.html","R ONC":"radonc.html","RADGY":"radiol.html","REHAB":"rehab.html","RELIG":"religion.html","RES D":"restor.html","RHB PO":"rhbpo.html","ROMN":"romanian.html","RUSS":"russian.html","S ASIA":"sasian.html","SBSE":"sbse.html","SCAND":"scand.html","SCM":"scm.html","SEASIA":"seasia.html","SEFS":"sefs.html","SLAVIC":"slavic.html","SLVN":"slvn.html","SMEA":"smea.html","SNKRT":"sanskrit.html","SOC":"soc.html","SOC WF":"socwlbasw.html","SOC WL":"socwl.html","SOCSCI":"socsci.html","SPAN":"spanish.html","SPH":"sph.html","SPHSC":"sphsc.html","SPLING":"spanlin.html","ST MGT":"stratm.html","STAT":"stat.html","STSS":"stss.html","SURG":"surg.html","SWA":"swa.html","SWED":"swedish.html","TAGLG":"taglg.html","TECHIN":"techin.html","THAI":"thai.html","TKISH":"turkish.html","TURKIC":"turkc.html","TXTDS":"txtds.html","UCONJ":"uconjoint.html","UGARIT":"ugarit.html","UKR":"ukrain.html","URBAN":"urban.html","URBDP":"urbdes.html","URDU":"urdu.html","UROL":"uro.html","UYGUR":"uygur.html","UZBEK":"uzbek.html","VIET":"viet.html"};
    function notice(msg){
        var old = document.getElementById("ftecalc-notice");
        if(old) old.remove();
        var shade = document.createElement("div");
        shade.id = "ftecalc-notice";
        shade.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(30,16,60,.28);display:flex;justify-content:center;align-items:flex-start;padding-top:32vh";
        shade.innerHTML = "<div role='alertdialog' style='width:min(440px,calc(100vw - 40px));background:#fff;border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,.35);overflow:hidden;font:15px/1.45 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#222'>"
            + "<div style='background:#2e1a5c;color:#fff;font-size:12px;font-weight:600;letter-spacing:.04em;padding:8px 16px'>FTECalc</div>"
            + "<div class='msg' style='padding:16px 18px 4px'></div>"
            + "<div style='padding:10px 18px 16px;text-align:right'><button type='button' style='background:#2e1a5c;color:#fff;border:0;border-radius:16px;padding:6px 20px;font:inherit;font-weight:600;cursor:pointer'>OK</button></div></div>";
        shade.querySelector(".msg").textContent = msg;
        var onKey = function(e){ if(e.key === "Escape" || e.key === "Enter"){ e.preventDefault(); close(); } };
        var close = function(){ shade.remove(); document.removeEventListener("keydown", onKey, true); };
        shade.addEventListener("click", function(e){ if(e.target === shade || e.target.tagName === "BUTTON") close(); });
        document.addEventListener("keydown", onKey, true);
        document.body.appendChild(shade);
        shade.querySelector("button").focus();
    }
    var at = location.href.match(/^(.*\/timeschd\/)(AUT|WIN|SPR|SUM)(\d{4})/i);
    if(!at){
        notice("Open the UW Time Schedule for any quarter (for example …/students/timeschd/AUT2026/), then click FTECalc again.");
        return;
    }
    /* The academic year of the page: Autumn starts one; Winter, Spring and Summer belong to the one that began the Autumn before. */
    var pageQ = at[2].toUpperCase(), pageY = parseInt(at[3], 10);
    var cfg = { base: at[1], startAY: pageQ === "AUT" ? pageY : pageY - 1, lookup: PREFIXES };
    var w = window.open("", "_blank");
    if(!w){
        notice("Pop-up blocked! Allow pop-ups for this site, then click FTECalc again.");
        return;
    }
    var PAGE_HTML = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>FTECalc</title><style>'
        + 'body{margin:0;background:#f4f2f8;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#222;font-size:14px}'
        + 'header{background:#2e1a5c;color:#fff;padding:12px 25px;display:flex;flex-wrap:wrap;align-items:center;gap:10px 22px;position:relative}header h1{margin:0;font-size:21px}'
        + 'header .ctl{display:flex;align-items:center;gap:8px;color:#e8e3d3}header select{font:inherit;font-size:14px;padding:6px 9px;border:0;border-radius:6px;background:#fff;color:#2e1a5c;cursor:pointer}'
        + 'header select.on{background:#c3b1f0;font-weight:600}#settings-btn{margin-left:auto;width:46px;height:46px;border:0;border-radius:50%;background:transparent;color:#fff;font-size:36px;line-height:1;cursor:pointer}'
        + '#settings-btn:hover,#settings-btn[aria-expanded=true]{background:rgba(255,255,255,.18)}'
        + '#settings{position:absolute;right:25px;top:100%;margin-top:6px;z-index:30;width:min(640px,calc(100vw - 50px));max-height:80vh;overflow:auto;background:#fff;color:#222;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.2);padding:14px 18px;font-size:14px}'
        + '.set-head{margin:6px 0 8px;color:#4b2e83;font-weight:700}.set-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;margin-bottom:10px}.set-grid label{display:flex;justify-content:space-between;align-items:center;gap:8px}'
        + '.set-grid select{font:inherit;font-size:13px;padding:3px 4px;border:1px solid #ccc;border-radius:4px;background:#fff;max-width:190px}.set-grid input,.budget input{width:90px;font:inherit;padding:3px 6px;border:1px solid #ccc;border-radius:4px}.set-note{font-size:12px;color:#777;margin:-4px 0 10px}.budget{display:flex;justify-content:space-between;align-items:center;margin:4px 0}'
        + '.pill-btn{border:1px solid #4b2e83;background:#fff;color:#4b2e83;border-radius:12px;padding:2px 11px;font:600 12px inherit;cursor:pointer}.pill-btn:hover{background:#efe9f9}'
        + '.bar{background:#fff;margin:15px 25px 0;padding:10px 16px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.05);display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px}'
        + '.bar strong{color:#4b2e83;font-size:12px;text-transform:uppercase;letter-spacing:.05em}.chip{display:inline-flex;align-items:center;gap:6px;background:#4b2e83;color:#fff;border-radius:14px;padding:3px 6px 3px 11px;font-size:13px;font-weight:600}'
        + '.chip button{background:none;border:0;color:#cbbfe6;font-size:16px;line-height:1;cursor:pointer;padding:0 4px;border-radius:8px}.chip button:hover{color:#fff;background:rgba(255,255,255,.15)}'
        + '#prefix-input{font:inherit;padding:5px 9px;border:1px solid #ccc;border-radius:5px;width:230px}#prefix-input.bad{border-color:#b91c1c}#load-status{font-size:13px;color:#666}#load-status.warn{color:#b45309}'
        + '.summary{display:grid;grid-template-columns:1fr 1.5fr 1fr 1fr;background:#fff;margin:15px 25px 0;padding:14px 0;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.05)}'
        + '.summary section{padding:0 22px;border-left:2px solid #e8e3f3}.summary section:first-child{border-left:none}@media (max-width:1000px){.summary{grid-template-columns:1fr}.summary section{border-left:none;padding-bottom:10px}}'
        + '.summary h4{margin:0 0 4px;color:#85754d;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em}.big{font-size:29px;font-weight:700;color:#4b2e83;line-height:1.2}.big small{font-size:14px;font-weight:600;margin-left:6px}'
        + '.parts{font-size:13px;color:#444;margin-top:3px;line-height:1.55}.parts b{color:#2e1a5c}.note{font-size:12px;color:#777}.warn-note{font-size:12px;color:#b45309}.linkish{background:none;border:0;padding:0;font:inherit;font-size:12px;color:#4b2e83;text-decoration:underline;cursor:pointer}'
        + '.panel{background:#fff;margin:15px 25px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.05);overflow:hidden}.panel h2{margin:0;background:#2e1a5c;color:#fff;font-size:18px;padding:10px 20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}'
        + '.panel h2 .sub{font-size:13px;font-weight:normal;color:#cbbfe6}.panel .body{padding:10px 16px 14px;overflow-x:auto}.empty{padding:14px 4px;color:#777;font-size:13px}'
        + 'table{border-collapse:collapse;width:100%;font-size:13px}th{text-align:left;color:#4b2e83;font-size:12px;border-bottom:2px solid #ddd;padding:6px 8px;vertical-align:bottom;white-space:nowrap}th[data-sort]{cursor:pointer}'
        + 'td{border-bottom:1px solid #eee;padding:6px 8px;vertical-align:middle}td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}td.name{font-weight:600;white-space:nowrap}tr.total td{border-top:2px solid #ddd;border-bottom:none;font-weight:700}'
        + '.bar-cat{display:flex;height:12px;width:170px;border-radius:3px;overflow:hidden;background:#eee}.bar-cat i{display:block}.key{display:inline-flex;flex-wrap:wrap;gap:4px 10px;font-size:12px;color:#666;font-weight:normal}.key span::before{content:"";display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px;vertical-align:-1px;background:var(--c)}'
        + '.cc{display:inline-block;border:1px solid #cfc5e6;border-radius:10px;padding:0 7px;margin:1px 3px 1px 0;font-size:12px;color:#2e1a5c;background:#fff;white-space:nowrap;cursor:help}.cc.none{border-style:dashed;color:#bbb;cursor:default}.cc sup{font-size:9px;margin-left:1px}'
        + '.pill{display:inline-block;border-radius:10px;padding:1px 8px;font-size:12px;font-weight:600;white-space:nowrap}.under{background:#e0ecff;color:#1d4ed8}.at{background:#e7f6ec;color:#15803d}.over{background:#fef3c7;color:#92400e}.plain{color:#444;font-weight:normal}'
        + '.flag-hi{background:#fef3c7;color:#92400e;border-radius:4px;padding:1px 6px;font-weight:600}.flag-lo{background:#e0ecff;color:#1d4ed8;border-radius:4px;padding:1px 6px;font-weight:600}'
        + 'select.cat{font:inherit;font-size:12px;border:1px solid #ddd;border-radius:4px;padding:1px 3px;background:#fff}select.cat.unset{color:#9a6a87;border-color:#e2b6c8;background:#fbf3f7}input.load{width:44px;font:inherit;font-size:12px;padding:1px 4px;border:1px solid #ddd;border-radius:4px}'
        + 'tr.unassigned td{color:#666;font-style:italic}.dim{color:#888;font-weight:normal}'
        + 'footer{margin:0 25px 25px;font-size:12px;color:#666;line-height:1.5}'
        + '@media (max-width:600px){header{padding:12px 16px}.bar,.summary,.panel{margin-left:16px;margin-right:16px}footer{margin:0 16px 16px}#settings{right:16px;width:calc(100vw - 32px)}.set-grid{grid-template-columns:1fr}}'
        + '</style></head><body>';
    w.document.open();
    w.document.write(PAGE_HTML + "<script>(" + app.toString() + ")(" + JSON.stringify(cfg).replace(/</g, "\\u003c") + ");<\/script></body></html>");
    w.document.close();

    function app(cfg){
        var QTRS = ["AUT", "WIN", "SPR"], QNAME = { AUT: "Autumn", WIN: "Winter", SPR: "Spring" }, QS = { AUT: "Aut", WIN: "Win", SPR: "Spr" };
        var CATS = { tt: "Tenure track", teach: "Teaching track", grad: "Grad instructor", other: "Other", unset: "Not set", unassigned: "Unassigned (STAFF, TBA)" };
        var CAT_ORDER = ["tt", "teach", "grad", "other", "unset", "unassigned"];
        var CAT_COLOR = { tt: "#4b2e83", teach: "#9d86d6", grad: "#d9b44a", other: "#6f9fc9", unset: "#e2b6c8", unassigned: "#c9c9cf" };
        var DEFAULTS = { ttLoad: 4, teachLoad: 6, unsetLoad: 4, gradShare: 0.25, taPerQuarter: 6, coteach: "split", casLower: 10, casUpper: 5 };

        /* What's kept in this browser: settings, each instructor's category (and load for "Other"), budgets, and the prefixes. */
        function load(key, fallback){ try { var v = JSON.parse(localStorage.getItem(key)); return v === null || v === undefined ? fallback : v; } catch(e){ return fallback; } }
        function store(key, v){ try { localStorage.setItem(key, JSON.stringify(v)); } catch(e){} }
        var settings = Object.assign({}, DEFAULTS, load("ftecalc-settings", {}));
        var people = load("ftecalc-people", {});
        var budgets = load("ftecalc-budgets", {});
        var prefixes = load("ftecalc-prefixes", []).filter(function(p){ return cfg.lookup[p]; });
        var view = { ay: cfg.startAY, program: "all", facSort: "cat" };
        var cache = {};

        function esc(s){ return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
        function ayLabel(ay){ return ay + "–" + String(ay + 1).slice(2); }
        function quarterYear(q, ay){ return q === "AUT" ? ay : ay + 1; }
        function fmt(n){ return Math.round(n).toLocaleString("en-US"); }
        function f2(n){ return (Math.round(n * 100) / 100).toFixed(2); }
        function money(n){ return "$" + Math.round(n).toLocaleString("en-US"); }
        function andList(xs){ return xs.length > 1 ? xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1] : xs.join(""); }
        function plural(n, one, many){ return n + " " + (n === 1 ? one : (many || one + "s")); }

        /* ---- Reading Time Schedule pages (after Ben Marwick's parser) ----
           A course heading is "PREFIX  NNN  TITLE". A section line is "SLN SEC CREDITS DAYS TIME BLDG ROOM INSTRUCTOR STATUS ENRL/LIM".
           Counted: lecture sections (one-letter section IDs) of courses 100-599, Honors included; 99s (independent study) and
           600+ are not. A section with a credit range ("1-5") counts its lower end; "VAR" sections are skipped (and counted);
           sections with a limit of 0 are placeholders. Quiz sections (QZ) are read for the TA estimate. */
        var prefixRe = new RegExp("^(" + Object.keys(cfg.lookup).sort(function(a, b){ return b.length - a.length; })
            .map(function(p){ return p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")\\s+(\\d{3})([A-Z]?)\\s{2,}(.*)");
        function titleCase(s){ return s.toLowerCase().replace(/(^|[^a-z0-9'])([a-z])/g, function(m, a, b){ return a + b.toUpperCase(); }); }
        function personName(raw){ var p = raw.split(","); return p.length > 1 ? titleCase(p[0].trim()) + ", " + titleCase(p.slice(1).join(",").trim()) : titleCase(raw.trim()); }
        /* The part of a section line before its enrollment: meeting (days, time, room), then instructors, "/" between co-teachers. */
        function meetingAndPeople(before){
            var b = before.replace(/to be arranged/gi, " ");
            var first = b.search(/[A-Za-z\-'.]+(?: [A-Za-z\-'.]+)*,\s?[A-Za-z]/);
            var meet = (first >= 0 ? b.slice(0, first) : b).replace(/\s+/g, " ").trim();
            var who = first < 0 ? [] : b.slice(first).split(/\s{2,}/)[0].split("/")
                .map(function(x){ return x.trim(); }).filter(function(x){ return /,/.test(x); }).map(personName);
            return { meet: /\d{3,4}-\d{3,4}/.test(meet) ? meet : "", who: who, staff: !who.length && /\bSTAFF\b/i.test(b) };
        }
        function parsePage(html, prefix){
            var text = html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(tr|table|div|p)>/gi, "\n").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
            var page = { lectures: [], quizzes: [], varSkipped: 0 }, course = null;
            text.split("\n").forEach(function(raw){
                var line = raw.trim();
                if(!line) return;
                var h = line.match(prefixRe);
                if(h && line.indexOf("SLN") === -1){
                    var num = parseInt(h[2], 10), title = h[4].split(",")[0].trim().replace(/\s{2,}/g, " ");
                    course = h[1].trim() === prefix && num >= 100 && num < 600 && !/99$/.test(h[2])
                        ? { prefix: prefix, number: h[2] + h[3], level: Math.floor(num / 100), title: title.replace(/\s*\([^)]*\)\s*$/, ""), honors: /HONORS/i.test(title) } : null;
                    return;
                }
                if(!course) return;
                var s = line.match(/^(?:[A-Za-z]+\s*)*>?\s*(\d{4,5})\s+([A-Z][A-Z0-9]{0,2})\s+(\S+)(.*)$/), el = line.match(/(\d+)\s*\/\s*(\d+)/);
                if(!s || !el) return;
                var rest = s[4], cut = rest.indexOf(el[0]), info = meetingAndPeople(cut >= 0 ? rest.slice(0, cut) : rest);
                var sec = { prefix: prefix, number: course.number, level: course.level, title: course.title, sec: s[2], sln: s[1], enrl: +el[1], lim: +el[2], meet: info.meet, who: info.who, staff: info.staff };
                if(/^QZ/.test(s[3])){ if(s[2].length > 1) page.quizzes.push(sec); return; }
                if(s[2].length !== 1) return;
                var cm = s[3].match(/^(\d+)(-\d*)?/);
                if(!cm){ page.varSkipped++; return; }
                if(!sec.lim) return;
                sec.credits = +cm[1]; sec.creditRange = !!cm[2]; sec.honors = course.honors;
                page.lectures.push(sec);
            });
            return page;
        }
        /* TA names are replaced as each page loads: TA1, TA2... (this session's own numbering), "instructor" when a quiz section
           lists its own lecture's instructor, otherwise STAFF or blank. Names are never kept. */
        var taLabels = {}, taCount = 0;
        function labelQuizzes(page){
            var lectureOf = {};
            page.lectures.forEach(function(l){ lectureOf[l.number + "|" + l.sec] = l; });
            page.quizzes.forEach(function(z){
                var lec = lectureOf[z.number + "|" + z.sec.charAt(0)], name = z.who[0];
                z.leader = name ? (lec && lec.who.indexOf(name) !== -1 ? "instructor" : taLabels[name] || (taLabels[name] = "TA" + (++taCount))) : z.staff ? "STAFF" : "blank";
                delete z.who; delete z.staff; delete z.meet;
            });
        }
        function loadPrefix(prefix, ay){
            var key = ay + "|" + prefix;
            if(cache[key]) return cache[key].ready;
            var entry = cache[key] = {};
            entry.ready = Promise.all(QTRS.map(function(q){
                var url = cfg.base + q + quarterYear(q, ay) + "/" + cfg.lookup[prefix];
                status("Loading " + prefix + " " + QNAME[q] + " " + quarterYear(q, ay) + "…");
                return fetch(url).then(function(r){
                    if(!r.ok) return { status: "missing", lectures: [], quizzes: [], varSkipped: 0 };
                    return r.text().then(function(t){ var pg = parsePage(t, prefix); labelQuizzes(pg); pg.status = pg.lectures.length ? "ok" : "empty"; return pg; });
                }).catch(function(){ return { status: "error", lectures: [], quizzes: [], varSkipped: 0 }; }).then(function(pg){ entry[q] = pg; });
            })).then(function(){ entry.done = true; });
            return entry.ready;
        }

        /* ---- Counting ---- */
        function catOf(name){ var p = people[name]; return p && CATS[p.cat] && p.cat !== "unassigned" ? p.cat : "unset"; }
        function loadOf(person){
            if(person.cat === "tt") return settings.ttLoad;
            if(person.cat === "teach") return settings.teachLoad;
            if(person.cat === "grad") return 1 / settings.gradShare;
            if(person.cat === "other") return (people[person.name] && +people[person.name].load) || settings.unsetLoad;
            return settings.unsetLoad;
        }
        function fteOf(person){ return person.count / loadOf(person); }
        function mostCommon(values, prefer){
            var n = {};
            values.forEach(function(v){ n[v] = (n[v] || 0) + 1; });
            return Object.keys(n).map(Number).sort(function(a, b){ return n[b] - n[a] || Math.abs(a - prefer) - Math.abs(b - prefer) || b - a; })[0];
        }
        /* Everything for one set of prefixes. A "course" for load is a lecture section, except that sections in the same quarter
           with the same instructors, days, time and room (combined 4xx/5xx sections, joint listings) count once. A co-taught
           course's SCH is split evenly among its instructors (after Ben Marwick); the course itself is split too, unless
           Settings counts it in full for each. */
        function analyze(set){
            var a = { quarters: {}, lectures: [], quizzes: [], varSkipped: 0, persons: [], sch: 0, schByQ: {}, loading: false };
            var rank = ["missing", "error", "empty", "ok"];
            QTRS.forEach(function(q){ a.quarters[q] = "missing"; a.schByQ[q] = 0; });
            set.forEach(function(p){
                var c = cache[view.ay + "|" + p];
                if(!c || !c.done) a.loading = true;
                if(!c) return;
                QTRS.forEach(function(q){
                    var pg = c[q];
                    if(!pg) return;
                    if(rank.indexOf(pg.status) > rank.indexOf(a.quarters[q])) a.quarters[q] = pg.status;
                    pg.lectures.forEach(function(l){ a.lectures.push(Object.assign({ qtr: q }, l)); });
                    pg.quizzes.forEach(function(z){ a.quizzes.push(Object.assign({ qtr: q }, z)); });
                    a.varSkipped += pg.varSkipped;
                });
            });
            var groups = {}, list = [];
            a.lectures.forEach(function(l){
                var key = l.who.length && l.meet ? l.qtr + "|" + l.who.slice().sort().join("/") + "|" + l.meet : l.qtr + "|" + l.prefix + "|" + l.sln;
                var g = groups[key];
                if(!g){ g = groups[key] = { qtr: l.qtr, who: l.who, sections: [] }; list.push(g); }
                g.sections.push(l);
            });
            var persons = {};
            list.forEach(function(g){
                var names = g.who.length ? g.who : ["Unassigned (STAFF, TBA)"], n = g.who.length || 1;
                var sch = g.sections.reduce(function(s, l){ return s + l.credits * l.enrl; }, 0);
                var share = n > 1 && settings.coteach === "split" ? 1 / n : 1;
                a.sch += sch;
                a.schByQ[g.qtr] += sch;
                names.forEach(function(name){
                    var p = persons[name] || (persons[name] = { name: name, cat: g.who.length ? catOf(name) : "unassigned", courses: { AUT: [], WIN: [], SPR: [] }, count: 0, sch: 0, students: 0, classes: 0, parts: [] });
                    p.courses[g.qtr].push({ g: g, share: share });
                    p.count += share;
                    p.sch += sch / n;
                    p.parts.push({ label: g.sections.map(function(l){ return l.prefix + " " + l.number; }).join("/"), sch: sch / n });
                    p.students += g.sections.reduce(function(s, l){ return s + l.enrl; }, 0);
                    p.classes++;
                });
            });
            a.persons = Object.keys(persons).map(function(k){ return persons[k]; });
            a.persons.forEach(function(p){ p.fte = fteOf(p); p.load = loadOf(p); });
            a.fteByCat = {};
            CAT_ORDER.forEach(function(c){ a.fteByCat[c] = 0; });
            var schByCat = {};
            CAT_ORDER.forEach(function(c){ schByCat[c] = 0; });
            a.persons.forEach(function(p){ a.fteByCat[p.cat] += p.fte; schByCat[p.cat] += p.sch; });
            a.schByCat = schByCat;
            a.instrFte = a.persons.reduce(function(s, p){ return s + p.fte; }, 0);
            a.unset = a.persons.filter(function(p){ return p.cat === "unset"; }).length;
            /* Concentration (after Ben Marwick): the share of SCH taught by the top quarter of instructors. */
            var teachers = a.persons.filter(function(p){ return p.cat !== "unassigned"; }).sort(function(x, y){ return y.sch - x.sch; });
            var top = Math.ceil(teachers.length / 4), teacherSch = teachers.reduce(function(s, p){ return s + p.sch; }, 0);
            a.topShare = teacherSch ? teachers.slice(0, top).reduce(function(s, p){ return s + p.sch; }, 0) / teacherSch : null;
            a.topCount = top;
            a.tas = taEstimate(a.lectures, a.quizzes);
            a.taPositions = a.tas.reduce(function(s, t){ return s + t.tas; }, 0);
            a.taFte = a.taPositions / settings.taPerQuarter;
            a.taStudents = a.tas.reduce(function(s, t){ return s + t.students; }, 0);
            return a;
        }
        /* TAs per course and quarter, estimated from quiz sections as in TimeScheduleMod: named TAs, plus sections with students
           but no TA at the course's usual load (sections per TA), after topping up named TAs who have fewer; empty sections
           aren't counted. A TA's load counts their quiz sections in the quarter across everything loaded. */
        function taEstimate(lectures, quizzes){
            var rows = [];
            QTRS.forEach(function(q){
                var all = [];
                prefixes.forEach(function(p){ var c = cache[view.ay + "|" + p]; if(c && c[q]) all = all.concat(c[q].quizzes); });
                var load = {};
                all.forEach(function(z){ if(/^TA\d+$/.test(z.leader)) load[z.leader] = (load[z.leader] || 0) + 1; });
                var loads = Object.keys(load).map(function(k){ return load[k]; }), usual = loads.length ? mostCommon(loads, 2) : 2;
                var lectureOf = {}, courses = {};
                lectures.filter(function(l){ return l.qtr === q; }).forEach(function(l){ lectureOf[l.prefix + "|" + l.number + "|" + l.sec] = l; });
                quizzes.filter(function(z){ return z.qtr === q && lectureOf[z.prefix + "|" + z.number + "|" + z.sec.charAt(0)]; }).forEach(function(z){
                    var k = z.prefix + " " + z.number, c = courses[k] || (courses[k] = { qtr: q, course: k, quizSections: 0, named: {}, needs: 0, empty: 0, lecs: {} });
                    c.quizSections++;
                    c.lecs[z.sec.charAt(0)] = lectureOf[z.prefix + "|" + z.number + "|" + z.sec.charAt(0)];
                    if(/^TA\d+$/.test(z.leader)) c.named[z.leader] = true;
                    else if(z.enrl > 0) c.needs++;
                    else c.empty++;
                });
                Object.keys(courses).forEach(function(k){
                    var c = courses[k], named = Object.keys(c.named);
                    c.load = named.length ? mostCommon(named.map(function(n){ return load[n]; }), usual) : usual;
                    var spare = named.reduce(function(s, n){ return s + Math.max(0, c.load - load[n]); }, 0);
                    c.taken = Math.min(c.needs, spare);
                    c.more = Math.ceil((c.needs - c.taken) / c.load);
                    c.namedCount = named.length;
                    c.tas = named.length + c.more;
                    c.students = Object.keys(c.lecs).reduce(function(s, x){ return s + c.lecs[x].enrl; }, 0);
                    rows.push(c);
                });
            });
            return rows;
        }

        /* ---- Page ---- */
        var ayOptions = [];
        for(var y = cfg.startAY; y > cfg.startAY - 7; y--) ayOptions.push(y);
        document.body.innerHTML = "<header><h1>FTECalc</h1>"
            + "<span class='ctl'>Academic year <select id='ay' aria-label='Academic year'>" + ayOptions.map(function(y){ return "<option value='" + y + "'>" + ayLabel(y) + " (Aut, Win, Spr)</option>"; }).join("") + "</select></span>"
            + "<span class='ctl'>Program <select id='program' aria-label='Program' title='Show one program throughout the page'><option value='all'>All programs</option></select></span>"
            + "<button type='button' id='settings-btn' aria-expanded='false' aria-controls='settings' aria-label='Settings' title='Settings'>⚙</button>"
            + "<div id='settings' hidden></div></header>"
            + "<div class='bar'><strong>Prefixes</strong><span id='chips'></span><input id='prefix-input' placeholder='Add a prefix, e.g. PHIL' spellcheck='false' autocomplete='off' title='One or more course prefixes, comma-separated; each prefix is a program'><span id='load-status'></span></div>"
            + "<div class='summary' id='summary'></div>"
            + "<div class='panel' id='panel-programs'><h2>Programs compared <span class='sub'>how each program uses its teaching resources</span></h2><div class='body' id='programs'></div></div>"
            + "<div class='panel' id='panel-faculty'><h2>Faculty and instructor loads <span class='sub'>courses against each person’s annual load</span></h2><div class='body' id='faculty'></div></div>"
            + "<div class='panel' id='panel-tas'><h2>TA allocation <span class='sub'>students per TA, by course and quarter</span></h2><div class='body' id='tas'></div></div>"
            + "<footer>Reads only the Time Schedule’s section listings: no student data, and TAs are counted, never named. Categories, loads and budgets stay in this browser. Summer is never counted. "
            + "<span title='Past quarters show final enrollment. UW’s official SCH uses 10th-day counts, so these figures are close but not identical.'>Enrollment is live.</span></footer>";

        function status(text, warn){ var el = document.getElementById("load-status"); el.textContent = text || ""; el.classList.toggle("warn", !!warn); }
        function renderChips(){
            document.getElementById("chips").innerHTML = prefixes.map(function(p){ return "<span class='chip'>" + esc(p) + "<button type='button' data-remove='" + esc(p) + "' aria-label='Remove " + esc(p) + "'>×</button></span>"; }).join("");
            var sel = document.getElementById("program");
            sel.innerHTML = "<option value='all'>All programs</option>" + prefixes.map(function(p){ return "<option value='" + esc(p) + "'>" + esc(p) + "</option>"; }).join("");
            if(view.program !== "all" && prefixes.indexOf(view.program) === -1) view.program = "all";
            sel.value = view.program;
            sel.classList.toggle("on", view.program !== "all");
        }
        function chipHtml(p, g, part){
            var lecs = g.sections, label = lecs.map(function(l){ return (prefixes.length > 1 ? l.prefix + " " : "") + l.number; }).join("/");
            var low = lecs.filter(function(l){ return l.enrl < (l.level <= 3 ? settings.casLower : settings.casUpper); });
            var lines = lecs.map(function(l){
                var min = l.level <= 3 ? settings.casLower : settings.casUpper;
                return l.prefix + " " + l.number + " " + l.sec + " · " + l.title + (l.honors ? " (Honors)" : "") + " · " + l.credits + (l.creditRange ? "+" : "") + " cr · " + l.enrl + "/" + l.lim + " students" + (l.enrl < min ? " ⚠ below the CAS minimum of " + min : "");
            });
            if(lecs.length > 1) lines.push("Counted as one course: same instructors, days, time and room");
            if(g.who.length > 1) lines.push("Co-taught with " + g.who.filter(function(n){ return n !== p.name; }).join(", ") + ": " + (part.share < 1 ? "counts " + (Math.round(part.share * 100) / 100) + " of a course; " : "") + "SCH split evenly");
            return "<span class='cc' title='" + esc(lines.join("\n")) + "'>" + esc(label) + (part.share < 1 ? "<sup>" + (part.share === 0.5 ? "½" : f2(part.share)) + "</sup>" : "") + (low.length ? " ⚠" : "") + "</span>";
        }
        function balance(p){
            if(p.parts.length < 2) return "<span class='dim' title='All of this SCH comes from one course'>one course</span>";
            var total = p.parts.reduce(function(s, x){ return s + x.sch; }, 0), ent = 0, top = p.parts[0];
            p.parts.forEach(function(x){ var r = total ? x.sch / total : 0; if(r > 0) ent -= r * Math.log(r); if(x.sch > top.sch) top = x; });
            var even = Math.round(ent / Math.log(p.parts.length) * 100);
            var word = even >= 75 ? "balanced" : even >= 45 ? "moderately skewed" : "highly skewed";
            return "<span title='How evenly this person’s SCH is spread across their courses (after Ben Marwick): " + word + ". " + Math.round(total ? top.sch / total * 100 : 0) + "% of it comes from " + esc(top.label) + ".'>" + even + "% even</span>";
        }

        function renderSummary(a){
            var why = { missing: "not published yet", empty: "no sections listed", error: "couldn’t be read" }, gaps = {};
            QTRS.forEach(function(q){ if(a.quarters[q] !== "ok") (gaps[a.quarters[q]] = gaps[a.quarters[q]] || []).push(QNAME[q] + " " + quarterYear(q, view.ay)); });
            var partial = a.loading || !prefixes.length ? "" : (gaps.missing || []).length === 3 ? "<div class='warn-note'>No Time Schedule for " + ayLabel(view.ay) + "</div>"
                : Object.keys(gaps).map(function(k){ return "<div class='warn-note'>" + andList(gaps[k]) + " " + why[k] + (k === "missing" ? ": a partial year" : "") + "</div>"; }).join("");
            var sect = function(h, big, parts){ return "<section><h4>" + h + "</h4><div class='big'>" + big + "</div><div class='parts'>" + parts + "</div></section>"; };
            var fteParts = CAT_ORDER.filter(function(c){ return a.fteByCat[c] > 0; }).map(function(c){ return esc(c === "unassigned" ? "Unassigned" : CATS[c]) + " <b>" + f2(a.fteByCat[c]) + "</b>"; });
            fteParts.push("TAs <b>" + f2(a.taFte) + "</b>");
            var set = view.program === "all" ? prefixes : [view.program], budget = 0, budgetSch = 0;
            set.forEach(function(p){ if(+budgets[p] > 0){ budget += +budgets[p]; budgetSch += analyzeCached(p).sch; } });
            var unsetNote = a.unset ? "<div><button type='button' class='linkish' data-goto='faculty'>" + plural(a.unset, "instructor") + " without a category</button> <span class='note'>(counted at " + settings.unsetLoad + " courses a year)</span></div>" : "";
            document.getElementById("summary").innerHTML =
                sect("Student credit hours", fmt(a.sch), QTRS.map(function(q){ return QS[q] + " <b>" + (a.quarters[q] === "ok" ? fmt(a.schByQ[q]) : "–") + "</b>"; }).join(" · ") + partial
                    + (a.varSkipped ? "<div class='note' title='Sections whose credits are listed as VAR have no fixed credits, so they’re left out'>" + plural(a.varSkipped, "variable-credit section") + " not counted</div>" : ""))
                + sect("Instructional FTE", f2(a.instrFte + a.taFte), fteParts.join(" · ") + unsetNote)
                + sect("SCH per FTE", a.instrFte ? fmt(a.sch / a.instrFte) + "<small>per instructor FTE</small>" : "–", a.instrFte + a.taFte ? "<b>" + fmt(a.sch / (a.instrFte + a.taFte)) + "</b> counting TAs too" : "")
                + sect("Cost per SCH", budget && budgetSch ? money(budget / budgetSch) : "–", budget ? "instructional (GOF) budget <b>" + money(budget) + "</b> ÷ SCH <button type='button' class='pill-btn' data-open='settings'>Edit budget</button>"
                    : "<button type='button' class='pill-btn' data-open='settings'>Add the instructional (GOF) budget</button>");
        }
        var analyzed = {};
        function analyzeCached(p){ var k = view.ay + "|" + p; return analyzed[k] || (analyzed[k] = analyze([p])); }
        function renderPrograms(){
            if(!prefixes.length){ document.getElementById("programs").innerHTML = "<div class='empty'>Add one or more course prefixes above. Each prefix is a program.</div>"; return; }
            var rows = prefixes.map(function(p){ return { name: p, a: analyzeCached(p), budget: +budgets[p] || 0 }; });
            if(prefixes.length > 1) rows.push({ name: "All programs", a: analyze(prefixes), budget: prefixes.reduce(function(s, p){ return s + (+budgets[p] || 0); }, 0), total: true });
            var SHORT = { tt: "TT", teach: "Teaching", grad: "Grad", other: "Other", unset: "Not set", unassigned: "Unassigned" };
            var cats = CAT_ORDER.filter(function(c){ return rows.some(function(r){ return r.a.schByCat[c] > 0; }); });
            document.getElementById("programs").innerHTML = "<table><thead><tr><th>Program</th><th class='n'>SCH</th><th class='n'>Instructor<br>FTE</th><th class='n'>TA<br>FTE</th><th class='n'>SCH per<br>instructor FTE</th>"
                + "<th>Who teaches the SCH <span class='key'>" + cats.map(function(c){ return "<span style='--c:" + CAT_COLOR[c] + "'>" + SHORT[c] + "</span>"; }).join("") + "</span></th>"
                + "<th class='n' title='Share of the program’s SCH taught by its top quarter of instructors (after Ben Marwick)'>Top 25%<br>teach</th><th class='n'>Students<br>per TA</th><th class='n'>Cost<br>per SCH</th></tr></thead><tbody>"
                + rows.map(function(r){
                    var a = r.a, t = a.sch || 1;
                    return "<tr" + (r.total ? " class='total' title='Joint-listed courses count once here, and once in each program above'" : "") + "><td class='name'>" + esc(r.name) + "</td><td class='n'>" + fmt(a.sch) + "</td><td class='n'>" + f2(a.instrFte) + "</td><td class='n'>" + f2(a.taFte) + "</td>"
                        + "<td class='n'>" + (a.instrFte ? fmt(a.sch / a.instrFte) : "–") + "</td><td><div class='bar-cat'>" + cats.map(function(c){ return a.schByCat[c] ? "<i style='width:" + (a.schByCat[c] / t * 100) + "%;background:" + CAT_COLOR[c] + "' title='" + esc(CATS[c]) + ": " + Math.round(a.schByCat[c] / t * 100) + "% of SCH'></i>" : ""; }).join("") + "</div></td>"
                        + "<td class='n'>" + (a.topShare === null ? "–" : "<span title='" + plural(a.topCount, "instructor") + "'>" + Math.round(a.topShare * 100) + "%</span>") + "</td>"
                        + "<td class='n'>" + (a.taPositions ? Math.round(a.taStudents / a.taPositions) : "–") + "</td><td class='n'>" + (r.budget && a.sch ? money(r.budget / a.sch) : "–") + "</td></tr>";
                }).join("") + "</tbody></table>";
        }
        function renderFaculty(a){
            var el = document.getElementById("faculty");
            if(!a.persons.length){ el.innerHTML = "<div class='empty'>No courses loaded yet.</div>"; return; }
            var order = function(p){ return CAT_ORDER.indexOf(p.cat); };
            var ps = a.persons.slice().sort(function(x, y){
                if(x.cat === "unassigned" || y.cat === "unassigned") return (x.cat === "unassigned") - (y.cat === "unassigned");
                if(view.facSort === "fte") return y.fte - x.fte || x.name.localeCompare(y.name);
                if(view.facSort === "sch") return y.sch - x.sch || x.name.localeCompare(y.name);
                if(view.facSort === "name") return x.name.localeCompare(y.name);
                return order(x) - order(y) || x.name.localeCompare(y.name);
            });
            var th = function(key, label, cls){ return "<th" + (cls ? " class='" + cls + "'" : "") + (key ? " data-sort='" + key + "' title='Sort'" : "") + ">" + label + (view.facSort === key ? " ▾" : "") + "</th>"; };
            el.innerHTML = "<table><thead><tr>" + th("name", "Instructor") + th("cat", "Category") + "<th class='n'>Load</th>" + QTRS.map(function(q){ return "<th>" + QS[q] + "</th>"; }).join("")
                + "<th class='n'>Courses</th>" + th("fte", "FTE", "n") + th("sch", "SCH", "n") + "<th class='n' title='Students per course; combined sections count as one class'>Avg<br>class</th><th>Balance</th></tr></thead><tbody>"
                + ps.map(function(p){
                    var un = p.cat === "unassigned";
                    var catCell = un ? "<span class='dim'>STAFF or TBA</span>" : "<select class='cat" + (p.cat === "unset" ? " unset" : "") + "' data-person='" + esc(p.name) + "' aria-label='Category for " + esc(p.name) + "'>"
                        + ["unset", "tt", "teach", "grad", "other"].map(function(c){ return "<option value='" + c + "'" + (c === p.cat ? " selected" : "") + ">" + (c === "unset" ? "Not set" : CATS[c]) + "</option>"; }).join("") + "</select>";
                    var loadCell = p.cat === "grad" ? "<span title='Each course counts " + settings.gradShare + " FTE'>" + (settings.gradShare === 0.25 ? "¼" : settings.gradShare) + " each</span>"
                        : p.cat === "other" ? "<input class='load' type='number' min='1' max='12' step='1' data-load='" + esc(p.name) + "' value='" + p.load + "' aria-label='Annual load for " + esc(p.name) + "'>"
                        : p.load + (p.cat === "unset" || un ? " <span class='dim'>(default)</span>" : "");
                    var cells = QTRS.map(function(q){ return "<td>" + (a.quarters[q] !== "ok" && a.quarters[q] !== "empty" ? "<span class='cc none' title='" + (a.loading ? "Loading" : a.quarters[q] === "error" ? "Couldn’t be read" : "Not published yet") + "'>…</span>" : p.courses[q].length ? p.courses[q].map(function(c){ return chipHtml(p, c.g, c); }).join("") : "<span class='cc none'>–</span>") + "</td>"; }).join("");
                    var n = Math.round(p.count * 100) / 100, pill = p.cat === "grad" || un ? "<span class='pill plain'>" + n + "</span>"
                        : "<span class='pill " + (n < p.load ? "under" : n > p.load ? "over" : "at") + "' title='" + (n < p.load ? "Under" : n > p.load ? "Over" : "At") + " this person’s annual load'>" + n + " of " + p.load + "</span>";
                    return "<tr" + (un ? " class='unassigned'" : "") + "><td class='name'>" + esc(p.name) + "</td><td>" + catCell + "</td><td class='n'>" + loadCell + "</td>" + cells
                        + "<td class='n'>" + pill + "</td><td class='n'>" + f2(p.fte) + "</td><td class='n'>" + fmt(p.sch) + "</td><td class='n'>" + (p.classes ? Math.round(p.students / p.classes) : "–") + "</td><td>" + (un ? "" : balance(p)) + "</td></tr>";
                }).join("") + "</tbody></table>";
        }
        function renderTAs(a){
            var el = document.getElementById("tas");
            if(!a.tas.length){ el.innerHTML = "<div class='empty'>No quiz sections in the courses loaded.</div>"; return; }
            var per = a.tas.filter(function(t){ return t.tas; }).map(function(t){ return t.students / t.tas; }).sort(function(x, y){ return x - y; }), med = per[Math.floor(per.length / 2)];
            el.innerHTML = "<table><thead><tr><th>Course</th><th>Quarter</th><th class='n'>Students</th><th class='n'>Quiz<br>sections</th><th class='n'>TAs (est.)</th><th class='n'>Students per TA</th></tr></thead><tbody>"
                + a.tas.sort(function(x, y){ return QTRS.indexOf(x.qtr) - QTRS.indexOf(y.qtr) || x.course.localeCompare(y.course); }).map(function(t){
                    var s = t.tas ? t.students / t.tas : null, cls = s === null ? "" : s > med * 1.25 ? "flag-hi" : s < med * 0.75 ? "flag-lo" : "";
                    var how = plural(t.namedCount, "TA") + " named (usually " + t.load + " sections each)" + (t.needs ? "; " + plural(t.needs, "section") + " with students but no TA" + (t.taken ? ", " + t.taken + " to named TAs" : "") + " → +" + t.more : "") + (t.empty ? "; " + plural(t.empty, "empty section") + " not counted" : "");
                    return "<tr><td class='name'>" + esc(t.course) + "</td><td>" + QS[t.qtr] + "</td><td class='n'>" + t.students + "</td><td class='n'>" + t.quizSections + "</td><td class='n' title='" + esc(how) + "'>" + t.tas + "</td>"
                        + "<td class='n'>" + (s === null ? "–" : "<span class='" + cls + "' title='" + (cls === "flag-hi" ? "Well above" : cls === "flag-lo" ? "Well below" : "Near") + " the median of " + Math.round(med) + "'>" + Math.round(s) + "</span>") + "</td></tr>";
                }).join("") + "</tbody></table>";
        }
        function renderSettings(){
            var num = function(id, label, value, attrs){ return "<label>" + label + " <input type='number' id='" + id + "' value='" + value + "' " + (attrs || "") + "></label>"; };
            document.getElementById("settings").innerHTML = "<div class='set-head'>Annual loads (courses a year)</div><div class='set-grid'>"
                + num("ttLoad", "Tenure track", settings.ttLoad, "min='1' max='12'") + num("teachLoad", "Teaching track", settings.teachLoad, "min='1' max='12'")
                + num("unsetLoad", "Not set, and unassigned courses", settings.unsetLoad, "min='1' max='12'") + num("gradShare", "Grad instructor: FTE per course", settings.gradShare, "min='0' max='1' step='0.05'")
                + num("taPerQuarter", "TA: one quarter is 1 ÷", settings.taPerQuarter, "min='1' max='12'")
                + "<label>Co-taught courses <select id='coteach'><option value='split'" + (settings.coteach === "split" ? " selected" : "") + ">split between instructors</option><option value='full'" + (settings.coteach === "full" ? " selected" : "") + ">count in full for each</option></select></label></div>"
                + "<div class='set-head'>CAS minimum enrollment (⚠ on a course)</div><div class='set-grid'>" + num("casLower", "100–300 level", settings.casLower, "min='0'") + num("casUpper", "400–500 level", settings.casUpper, "min='0'") + "</div>"
                + "<div class='set-head'>Instructional (GOF) budget, for cost per SCH</div>" + (prefixes.length ? prefixes.map(function(p){ return "<div class='budget'><span>" + esc(p) + "</span><input type='number' min='0' step='1000' data-budget='" + esc(p) + "' value='" + (budgets[p] || "") + "' placeholder='$'></div>"; }).join("") : "<p class='set-note'>Add a prefix first.</p>")
                + "<p class='set-note'>Kept in this browser only. Categories are set in the Faculty table.</p><button type='button' class='pill-btn' id='reset'>Reset loads to defaults</button>";
        }
        function render(){
            analyzed = {};
            renderChips();
            var a = analyze(view.program === "all" ? prefixes : [view.program]);
            renderSummary(a);
            renderPrograms();
            renderFaculty(a);
            renderTAs(a);
        }
        function loadAll(){
            if(!prefixes.length){ status(""); render(); return; }
            Promise.all(prefixes.map(function(p){ return loadPrefix(p, view.ay); })).then(function(){
                var failed = [];
                prefixes.forEach(function(p){ QTRS.forEach(function(q){ var c = cache[view.ay + "|" + p]; if(c[q] && c[q].status === "error") failed.push(p + " " + QS[q]); }); });
                if(failed.length) status("Couldn’t read " + failed.join(", ") + ". Still signed in to UW? Reload the Time Schedule, then FTECalc.", true);
                else status("");
                render();
            });
            render();
        }

        /* ---- Events ---- */
        document.getElementById("ay").addEventListener("change", function(){ view.ay = +this.value; loadAll(); });
        document.getElementById("program").addEventListener("change", function(){ view.program = this.value; render(); });
        var input = document.getElementById("prefix-input");
        function addPrefixes(){
            var asked = input.value.split(",").map(function(s){ return s.trim().toUpperCase().replace(/\s+/g, " "); }).filter(Boolean);
            if(!asked.length) return;
            var unknown = asked.filter(function(p){ return !cfg.lookup[p]; });
            input.classList.toggle("bad", unknown.length > 0);
            if(unknown.length){ status("Unknown prefix: " + unknown.join(", "), true); return; }
            asked.forEach(function(p){ if(prefixes.indexOf(p) === -1) prefixes.push(p); });
            store("ftecalc-prefixes", prefixes);
            input.value = "";
            loadAll();
        }
        input.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); addPrefixes(); } });
        input.addEventListener("change", addPrefixes);
        input.addEventListener("input", function(){ input.classList.remove("bad"); });
        document.getElementById("chips").addEventListener("click", function(e){
            var p = e.target.getAttribute("data-remove");
            if(!p) return;
            prefixes = prefixes.filter(function(x){ return x !== p; });
            store("ftecalc-prefixes", prefixes);
            loadAll();
        });
        document.getElementById("faculty").addEventListener("change", function(e){
            var t = e.target;
            if(t.matches("select.cat")){ var n = t.getAttribute("data-person"); people[n] = Object.assign({}, people[n], { cat: t.value }); store("ftecalc-people", people); render(); }
            if(t.matches("input.load")){ var m = t.getAttribute("data-load"), v = parseFloat(t.value); if(v > 0){ people[m] = Object.assign({}, people[m], { cat: "other", load: v }); store("ftecalc-people", people); render(); } }
        });
        document.getElementById("faculty").addEventListener("click", function(e){ var th = e.target.closest("th[data-sort]"); if(th){ view.facSort = th.getAttribute("data-sort"); render(); } });
        var settingsBtn = document.getElementById("settings-btn"), box = document.getElementById("settings");
        function showSettings(open){ if(open) renderSettings(); box.hidden = !open; settingsBtn.setAttribute("aria-expanded", String(open)); }
        settingsBtn.addEventListener("click", function(){ showSettings(box.hidden); });
        document.addEventListener("pointerdown", function(e){ if(!box.hidden && !e.target.closest("#settings, #settings-btn, [data-open]")) showSettings(false); });
        document.addEventListener("keydown", function(e){ if(e.key === "Escape" && !box.hidden) showSettings(false); });
        box.addEventListener("change", function(e){
            var t = e.target;
            if(t.hasAttribute("data-budget")){ var v = parseFloat(t.value); if(v > 0) budgets[t.getAttribute("data-budget")] = v; else delete budgets[t.getAttribute("data-budget")]; store("ftecalc-budgets", budgets); render(); return; }
            if(t.id === "coteach"){ settings.coteach = t.value; }
            else if(DEFAULTS.hasOwnProperty(t.id)){ var n = parseFloat(t.value); if(!(n > 0)) return; settings[t.id] = n; }
            else return;
            store("ftecalc-settings", settings);
            render();
        });
        box.addEventListener("click", function(e){ if(e.target.id === "reset"){ settings = Object.assign({}, DEFAULTS); store("ftecalc-settings", settings); renderSettings(); render(); } });
        document.getElementById("summary").addEventListener("click", function(e){
            if(e.target.closest("[data-open='settings']")) return showSettings(true);
            if(e.target.closest("[data-goto='faculty']")) document.getElementById("panel-faculty").scrollIntoView({ behavior: "smooth", block: "start" });
        });
        renderChips();
        loadAll();
    }
})();
