javascript:(function(){
    /* FTECalc: teaching FTE and student credit hours (SCH) for an academic year, from the UW Time Schedule.
       Run it on any Time Schedule quarter page (e.g. /students/timeschd/AUT2026/). It reads the Autumn, Winter and Spring
       pages of the course prefixes you choose (Summer is never counted) and opens a dashboard: a summary, programs
       compared, each instructor's FTE and courses, and TA allocation; an instructor's name opens their teaching history. It reads only the Time Schedule's section listings, so no
       student data; TA names become TA1, TA2... as pages load. Categories, FTEs and budgets you set stay in this browser.
       The prefix list and the way section lines are read follow Ben Marwick's Time Schedule tools (MIT license; see
       LICENSE), as do several ideas: splitting co-taught sections, the CAS minimum-enrollment warning, how evenly an
       instructor's SCH is spread, and how concentrated a program's SCH is. Design notes are in the README. */
    /* Each course prefix and its Time Schedule page, from Ben Marwick's Time Schedule tools. */
    var PREFIXES = {"A A":"aa.html","A E":"ae.html","A S":"88aerosci.html","AAS":"asamst.html","ACADEM":"academ.html","ACCTG":"acctg.html","ADMIN":"admin.html","AES":"aes.html","AFRAM":"afamst.html","AIS":"ais.html","AMATH":"appmath.html","AMHAR":"amhar.html","ANEST":"anest.html","ANTH":"anthro.html","ARAB":"arabic.html","ARAMIC":"aramic.html","ARCH":"archit.html","ARCHY":"archeo.html","ARCTIC":"arctic.html","ART":"art.html","ART H":"arthis.html","ARTS":"arts.html","ARTSCI":"artsci.html","ASIAN":"asianll.html","ASL":"asl.html","ASTBIO":"astbio.html","ASTR":"astro.html","ATMOS":"atmoscs.html","B A":"ba.html","B CMU":"buscomm.html","B E":"be.html","B ECON":"busecon.html","B H":"bh.html","B POL":"bpol.html","B STR":"biostruct.html","BA RM":"barm.html","BATY E":"batye.html","BCMS":"bcms.html","BENG":"beng.html","BIBHEB":"bibheb.html","BIME":"bime.html","BIO A":"bioanth.html","BIOC":"bioch.html","BIOEN":"bioeng.html","BIOL":"biology.html","BIOST":"biostat.html","BPSD":"bpsd.html","BULGR":"bulgar.html","BUS AN":"busan.html","C ENV":"cenv.html","C LIT":"complit.html","C MED":"compmed.html","CEE":"cee.html","CEP":"commenv.html","CESG":"cesg.html","CESI":"cesi.html","CET":"cet.html","CEWA":"cewa.html","CFRM":"cfrm.html","CHEM":"chem.html","CHEM E":"cheng.html","CHGTAI":"chgtai.html","CHID":"chid.html","CHIN":"chinese.html","CHSTU":"chist.html","CL AR":"clarch.html","CL LI":"cling.html","CLAS":"clas.html","CM":"constmgmt.html","CMS":"cms.html","COM":"com.html","COMMLD":"commld.html","CONJ":"conj.html","COPTIC":"coptic.html","CS&SS":"cs&ss.html","CSDE":"csde.html","CSE":"cse.html","CSE D":"csed.html","CZECH":"czech.html","D HYG":"denthy.html","DANCE":"dance.html","DANISH":"danish.html","DATA":"data.html","DENT":"dent.html","DENTCL":"dentcl.html","DENTEL":"dentel.html","DENTFN":"dentfn.html","DENTGP":"dentgp.html","DENTPC":"dentpc.html","DENTSL":"dentsl.html","DERM":"derm.html","DESIGN":"design.html","DIS ST":"disst.html","DPHS":"dphs.html","DRAMA":"drama.html","DXARTS":"dxarts.html","E E":"ee.html","EBIZ":"ebiz.html","ECE":"ece.html","ECFS":"ecfs.html","ECON":"econ.html","EDC&I":"edci.html","EDLPS":"edlp.html","EDPSY":"edpsy.html","EDSPE":"sped.html","EDTEP":"teached.html","EDUC":"indsrf.html","EGYPT":"egypt.html","ENDO":"endo.html","ENGL":"engl.html","ENGR":"engr.html","ENTRE":"entre.html","ENV H":"envh.html","ENVIR":"envst.html","EPI":"epidem.html","ESMS":"esms.html","ESRM":"esrm.html","ESS":"ess.html","ESTO":"eston.html","ETHICS":"ethics.html","FAMED":"famed.html","FHL":"fhl.html","FIN":"finance.html","FINN":"finnish.html","FISH":"fish.html","FRENCH":"french.html","G H":"gh.html","GCNSL":"gcnsl.html","GEEZ":"geez.html","GEN ST":"genst.html","GENOME":"genome.html","GEOG":"geog.html","GEORG":"georg.html","GERMAN":"germ.html","GIS":"gis.html","GLITS":"glits.html","GRDSCH":"grad.html","GREEK":"greek.html","GWSS":"gwss.html","HCDE":"hcde.html","HCID":"hcid.html","HCSS":"hcss.html","HDD":"hdd.html","HEBR":"hebrew.html","HEOR":"heor.html","HIHIM":"95hihim.html","HINDI":"hindi.html","HMS":"hms.html","HONORS":"hnrs.html","HPS":"hps.html","HRMOB":"hrmob.html","HSERV":"hlthsvcs.html","HSMGMT":"hsmgmt.html","HSTAA":"histam.html","HSTAFM":"hstafm.html","HSTAM":"ancmedh.html","HSTAS":"histasia.html","HSTCMP":"hstcmp.html","HSTEU":"modeuro.html","HSTLAC":"hstlac.html","HSTRY":"hstry.html","HUBIO":"humbio.html","HUM":"centhum.html","I BUS":"intlbus.html","I S":"infosys.html","ICEL":"icel.html","IECMH":"iecmh.html","IMMUN":"immun.html","IMT":"imt.html","IND E":"inde.html","INDIV":"indiv.html","INDN":"indian.html","INDO":"indo.html","INFO":"info.html","INSC":"insc.html","INTSCI":"intsci.html","IPHD":"iphd.html","IPM":"ipm.html","ITAL":"italian.html","JAPAN":"japanese.html","JEW ST":"jewst.html","JSIS":"jsis.html","JSIS A":"jsisa.html","JSIS B":"jsisb.html","JSIS C":"jsisc.html","JSIS D":"jsisd.html","JSIS E":"jsise.html","KAZAKH":"kazakh.html","KHMER":"khmer.html","KOREAN":"korean.html","KYRGYZ":"kyrgyz.html","L ARCH":"landscape.html","LAB M":"labmed.html","LABOR":"labor.html","LADINO":"ladino.html","LATIN":"latin.html","LATV":"latvian.html","LAW":"law.html","LAW A":"lawa.html","LAW B":"lawb.html","LAW C":"lawc.html","LAW E":"lawe.html","LAW H":"lawh.html","LAW P":"lawp.html","LAW T":"lawt.html","LEAD":"lead.html","LING":"ling.html","LIS":"lis.html","LIT":"lit.html","LITH":"lith.html","LSJ":"lsj.html","M E":"meche.html","M SCI":"88milsci.html","MARBIO":"marbio.html","MATH":"math.html","MCB":"mcb.html","MED":"medicine.html","MED EM":"medem.html","MEDCH":"medchem.html","MEDECK":"medeck.html","MEDENG":"medeng.html","MEDLIC":"medlic.html","MEDRCK":"medrck.html","MEDSCI":"medsci.html","MEIE":"meie.html","MELC":"melc.html","MGMT":"mgmt.html","MICROM":"microbio.html","MKTG":"mktg.html","MODHEB":"modheb.html","MOLENG":"moleng.html","MOLMED":"molmed.html","MS E":"mse.html","MSIS":"msis.html","MSTP":"mstp.html","MSW":"socwk.html","MUHST":"mushist.html","MUSAP":"appmus.html","MUSED":"mused.html","MUSEN":"musensem.html","MUSEUM":"museum.html","MUSIC":"music.html","MUSICP":"musicp.html","MUSTEC":"mustec.html","N SCI":"88navsci.html","N&MES":"nearmide.html","NBIO":"nbio.html","NCLIN":"nursingcl.html","NEUBIO":"neubio.html","NEUR S":"neurosurg.html","NEURL":"neurl.html","NEURO":"neuro.html","NEUSCI":"neusci.html","NME":"nme.html","NMETH":"nursingmeth.html","NORW":"norweg.html","NSG":"nsg.html","NURS":"nursing.html","NUTR":"nutrit.html","O E":"orgenv.html","O S":"os.html","OB GYN":"obgyn.html","OCEAN":"ocean.html","OHS":"ohs.html","OPHTH":"ophthal.html","OPMGT":"opmgmt.html","ORALB":"oralbio.html","ORALM":"oralm.html","ORTHO":"orthod.html","ORTHP":"orthop.html","OTOHN":"otol.html","P BIO":"physiolbio.html","PABIO":"pathobio.html","PATH":"patho.html","PBSCI":"psychbehav.html","PCEUT":"pharmceu.html","PEDO":"pedodon.html","PEDS":"pediat.html","PERIO":"perio.html","PHARBE":"pharbe.html","PHARM":"pharmacy.html","PHARMP":"pharmp.html","PHCOL":"pharma.html","PHG":"phg.html","PHI":"phi.html","PHIL":"phil.html","PHRMCY":"phrmcy.html","PHRMPR":"phrmpr.html","PHRMRA":"phrmra.html","PHRMSC":"phrmsc.html","PHYS":"phys.html","POL S":"polisci.html","POLSH":"polish.html","PORT":"port.html","PPM":"ppm.html","PROS":"pros.html","PRSAN":"persian.html","PSYCAP":"95psycap.html","PSYCH":"psych.html","PSYCLN":"psycln.html","PUBPOL":"pubpol.html","PUBSCH":"pubsch.html","Q SCI":"quantsci.html","QERM":"quante.html","QMETH":"qmeth.html","QUAT":"qrc.html","R E":"re.html","R ONC":"radonc.html","RADGY":"radiol.html","REHAB":"rehab.html","RELIG":"religion.html","RES D":"restor.html","RHB PO":"rhbpo.html","ROMN":"romanian.html","RUSS":"russian.html","S ASIA":"sasian.html","SBSE":"sbse.html","SCAND":"scand.html","SCM":"scm.html","SEASIA":"seasia.html","SEFS":"sefs.html","SLAVIC":"slavic.html","SLVN":"slvn.html","SMEA":"smea.html","SNKRT":"sanskrit.html","SOC":"soc.html","SOC WF":"socwlbasw.html","SOC WL":"socwl.html","SOCSCI":"socsci.html","SPAN":"spanish.html","SPH":"sph.html","SPHSC":"sphsc.html","SPLING":"spanlin.html","ST MGT":"stratm.html","STAT":"stat.html","STSS":"stss.html","SURG":"surg.html","SWA":"swa.html","SWED":"swedish.html","TAGLG":"taglg.html","TECHIN":"techin.html","THAI":"thai.html","TKISH":"turkish.html","TURKIC":"turkc.html","TXTDS":"txtds.html","UCONJ":"uconjoint.html","UGARIT":"ugarit.html","UKR":"ukrain.html","URBAN":"urban.html","URBDP":"urbdes.html","URDU":"urdu.html","UROL":"uro.html","UYGUR":"uygur.html","UZBEK":"uzbek.html","VIET":"viet.html"};
    /* FTECalc's own message box, shown inside the page: lower down than a browser alert, and headed so a first-time user knows
       the bookmarklet is installed and working (as in MyGradMod). OK, Enter, Escape or a click outside closes it. An optional
       link button takes the person where they need to go. */
    function notice(msg, link){
        var old = document.getElementById("ftecalc-notice");
        if(old) old.remove();
        var shade = document.createElement("div");
        shade.id = "ftecalc-notice";
        shade.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(30,16,60,.28);display:flex;justify-content:center;align-items:flex-start;padding-top:32vh";
        shade.innerHTML = "<div role='alertdialog' aria-labelledby='ftecalc-notice-head' style='width:min(440px,calc(100vw - 40px));background:#fff;border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,.35);overflow:hidden;font:15px/1.45 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#222'>"
            + "<div id='ftecalc-notice-head' style='background:#4b2e83;color:#fff;font-size:12px;font-weight:600;letter-spacing:.04em;padding:8px 16px'>FTECalc successfully installed</div>"
            + "<div class='msg' style='padding:16px 18px 4px'></div>"
            + "<div style='padding:10px 18px 16px;display:flex;justify-content:flex-end;align-items:center;gap:10px'><a class='go' style='display:none;color:#4b2e83;border:1px solid #4b2e83;border-radius:16px;padding:5px 16px;font-weight:600;text-decoration:none'></a>"
            + "<button type='button' style='background:#4b2e83;color:#fff;border:0;border-radius:16px;padding:6px 20px;font:inherit;font-weight:600;cursor:pointer'>OK</button></div></div>";
        shade.querySelector(".msg").textContent = msg;
        if(link){ var a = shade.querySelector(".go"); a.href = link.href; a.textContent = link.label; a.style.display = "inline-block"; }
        var onKey = function(e){ if(e.key === "Escape" || e.key === "Enter"){ e.preventDefault(); close(); } };
        var close = function(){ shade.remove(); document.removeEventListener("keydown", onKey, true); };
        shade.addEventListener("click", function(e){ if(e.target === shade || e.target.tagName === "BUTTON") close(); });
        document.addEventListener("keydown", onKey, true);
        document.body.appendChild(shade);
        shade.querySelector("button").focus();
    }
    var at = location.href.match(/^(.*\/timeschd\/)(AUT|WIN|SPR|SUM)(\d{4})/i);
    if(!at){
        /* On the Time Schedule's front page, which lists the quarters: pick one. Anywhere else: go there first. */
        if(/\/timeschd\/?(index\.html?)?$/i.test(location.pathname)) notice("Pick a quarter on this page (any quarter in the academic year you want), then click FTECalc again.");
        else notice("Open the UW Time Schedule: sign in with your UW NetID, pick any quarter (for example Autumn 2026), then click FTECalc again.", { href: "https://www.washington.edu/students/timeschd/", label: "Open the Time Schedule" });
        return;
    }
    /* The academic year of the page: Autumn starts one; Winter, Spring and Summer belong to the one that began the Autumn before.
       From Winter on, next Autumn may already be published, so the year menu also offers the next academic year. */
    var pageQ = at[2].toUpperCase(), pageY = parseInt(at[3], 10), startAY = pageQ === "AUT" ? pageY : pageY - 1;
    var cfg = { base: at[1], startAY: startAY, newestAY: pageQ === "AUT" ? startAY : startAY + 1, lookup: PREFIXES };
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
        + '.flag-hi{background:#fef3c7;color:#92400e;border-radius:4px;padding:1px 6px;font-weight:600}.flag-lo{background:#e0ecff;color:#1d4ed8;border-radius:4px;padding:1px 6px;font-weight:600}'
        + 'select.cat{font:inherit;font-size:12px;border:1px solid #ddd;border-radius:4px;padding:1px 3px;background:#fff}select.cat.unset{color:#9a6a87;border-color:#e2b6c8;background:#fbf3f7}input.fte{width:44px;font:inherit;font-size:12px;padding:1px 4px;border:1px solid #ddd;border-radius:4px;text-align:right}input.fte.set{background:#efe9f9;border-color:#9d86d6;color:#2e1a5c;font-weight:700}.share{font-size:12px;margin-left:5px;cursor:help}'
        + 'tr.unassigned td{color:#666;font-style:italic}.dim{color:#888;font-weight:normal}'
        + 'footer{margin:0 25px 25px;font-size:12px;color:#666;line-height:1.5}'
        + '.panel-toggle{background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;display:inline-flex;align-items:center}.panel-toggle .chev{display:inline-block;width:20px;font-size:13px;transition:transform .15s}'
        + '.panel.collapsed .body,.panel.collapsed h2 .sub{display:none}.panel.collapsed .panel-toggle .chev{transform:rotate(-90deg)}'
        + '#save-btn{margin-left:auto;display:inline-flex;align-items:center;gap:7px;background:#fff;color:#4b2e83;border:0;border-radius:16px;padding:6px 14px;font:600 13px inherit;font-family:inherit;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.2)}'
        + '#save-btn:hover{background:#f0ebfa}#save-btn:disabled{opacity:.55;cursor:default}#save-btn svg,.dlg-save svg{width:15px;height:15px;flex:none}#save-btn+#settings-btn{margin-left:0}'
        + '.shade{position:fixed;inset:0;background:rgba(30,16,60,.35);z-index:1000;display:flex;justify-content:center;align-items:flex-start;padding-top:90px}'
        + '.dlg{width:min(560px,calc(100vw - 32px));background:#fff;border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,.35);overflow:hidden}'
        + '.dlg h2{margin:0;background:#4b2e83;color:#fff;font-size:15px;font-weight:600;padding:8px 12px 8px 20px;display:flex;justify-content:space-between;align-items:center}'
        + '.dlg-x{background:none;border:0;color:#fff;font-size:20px;line-height:1;cursor:pointer;opacity:.75;padding:2px 7px;border-radius:4px}.dlg-x:hover{opacity:1;background:rgba(255,255,255,.15)}'
        + '.dlg-body{padding:16px 22px 4px;font-size:13px}.dlg-row{display:grid;grid-template-columns:92px 1fr;gap:10px;align-items:start;margin-bottom:14px}'
        + '.dlg-row>b{color:#4b2e83;font-size:12px;text-transform:uppercase;letter-spacing:.5px;padding-top:6px}'
        + '#save-note{width:100%;box-sizing:border-box;border:2px solid #b7a57a;border-radius:6px;padding:8px 10px;font:inherit;font-size:15px}#save-note:focus{outline:none;border-color:#4b2e83}'
        + '.picks{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px}.picks button{border:1px solid #4b2e83;background:#fff;color:#4b2e83;border-radius:14px;padding:2px 10px;font:inherit;font-size:12px;font-weight:600;cursor:pointer}'
        + '.picks button:hover{background:#e8e3d3}.picks button.on{background:#4b2e83;color:#fff}.dlg-val{padding-top:5px;line-height:1.55}.dlg-check{display:block;margin-top:5px;color:#333;cursor:pointer}.dlg-check input{margin:0 6px 0 0;vertical-align:-2px}'
        + '.dlg-file{font-family:Menlo,Consolas,monospace;font-size:12px;background:#f4f2f8;border-radius:5px;padding:6px 9px;margin-top:3px;overflow-wrap:anywhere}'
        + '.dlg-status{min-height:18px;font-size:12px;font-weight:600;color:#4b2e83;margin:-4px 0 4px}.dlg-status.err{color:#b91c1c}'
        + '.dlg-foot{display:flex;justify-content:flex-end;gap:10px;padding:8px 22px 18px}.dlg-foot button{font:inherit;font-size:13px;font-weight:600;border-radius:16px;padding:7px 16px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}'
        + '.dlg-cancel{background:#fff;border:1px solid #bbb;color:#444}.dlg-save{background:#4b2e83;border:0;color:#fff}.dlg-foot button:disabled{opacity:.6;cursor:default}'
        + '.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#2e1a5c;color:#fff;padding:10px 18px;border-radius:8px;font-size:13px;box-shadow:0 6px 20px rgba(0,0,0,.3);z-index:1001;max-width:calc(100vw - 40px)}'
        + '.saved-banner{display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:#fbf6e6;border-bottom:1px solid #e6d9b0;padding:9px 25px;font-size:14px;color:#3d2f0e}'
        + '.saved-tag{background:#85754d;color:#fff;font-size:11px;font-weight:700;letter-spacing:.08em;border-radius:4px;padding:3px 8px}.saved-note{font-weight:700;font-size:15px;color:#2e1a5c}.saved-meta{color:#6b5a2a}'
        + '.saved-right{margin-left:auto;font-size:12px;color:#85754d;cursor:help}.is-saved #prefix-input,.is-saved #save-btn,.is-saved .chip button{display:none}.is-saved #save-btn+#settings-btn{margin-left:auto}#chips{display:inline-flex;flex-wrap:wrap;gap:6px}.is-saved .chip{padding-right:11px}'
        + '.who{background:none;border:0;padding:0;font:inherit;font-weight:600;color:inherit;cursor:pointer;text-align:left}.who:hover{color:#4b2e83;text-decoration:underline}'
        + 'body.hist-open{overflow:hidden}#history{position:fixed;inset:0;z-index:900;background:#f4f2f8;overflow:auto}'
        + '.hist-bar{position:sticky;top:0;z-index:2;background:#2e1a5c;color:#e8e3d3;padding:10px 25px;display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px}.hist-bar .picks{margin:0}'
        + '.hist-back{background:#fff;color:#2e1a5c;border:0;border-radius:16px;padding:6px 14px;font:600 13px inherit;font-family:inherit;cursor:pointer}.hist-print{margin-left:auto}'
        + '.hist-page{background:#fff;max-width:1100px;margin:15px auto 25px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.05);padding:18px 24px 22px}'
        + '.hist-page h2{margin:0;color:#2e1a5c;font-size:23px}.hist-page h2 small{font-size:14px;font-weight:600;color:#85754d;margin-left:8px}.hist-sub{color:#555;font-size:13px;margin-top:3px}'
        + '.hist-names{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:10px 0 2px;font-size:12px;color:#666}.hist-names .chip{font-size:12px;font-weight:600;padding:2px 6px 2px 10px}.hist-names .chip.self{padding-right:10px}'
        + '#hist-add{font:inherit;font-size:12px;padding:3px 8px;border:1px solid #ccc;border-radius:12px;width:220px}#hist-add.bad{border-color:#b91c1c}#hist-note{font-size:12px;color:#777;min-height:16px;margin:6px 0}#hist-note.warn{color:#b45309}'
        + '.tiles-head{font-size:12px;color:#85754d;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin:12px 0 6px}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'
        + '.tile{border:1px solid #e8e3f3;border-radius:6px;padding:8px 12px;cursor:help}.tile .tl{font-size:12px;color:#666}.tile .tv{font-size:15px;color:#444;margin-top:2px}.tile .tv b{font-size:21px;color:#2e1a5c}.tile .td{font-size:13px;font-weight:600;color:#444;margin-top:1px}'
        + '.hist-chart{display:block;width:100%;height:auto;margin:16px 0 6px}.hist-table td.list{font-size:12px;color:#444;line-height:1.5;min-width:220px}tr.off td{color:#999}'
        + '@media print{body{background:#fff}body.hist-open{overflow:visible}body.hist-open>*:not(#history){display:none!important}#history{position:static;overflow:visible;background:#fff}.hist-bar,#hist-add,.hist-names button{display:none!important}.hist-page{box-shadow:none;margin:0;max-width:none;padding:0}.tile{break-inside:avoid}}'
        + '@media (max-width:600px){header{padding:12px 16px}.bar,.summary,.panel{margin-left:16px;margin-right:16px}footer{margin:0 16px 16px}#settings{right:16px;width:calc(100vw - 32px)}.set-grid{grid-template-columns:1fr}.hist-bar{padding:10px 16px}.hist-page{margin:12px 16px;padding:14px 16px}}'
        + '</style></head><body>';
    w.document.open();
    w.document.write(PAGE_HTML + "<script>(" + app.toString() + ")(" + JSON.stringify(cfg).replace(/</g, "\\u003c") + ");<\/script></body></html>");
    w.document.close();

    function app(cfg){
        var QTRS = ["AUT", "WIN", "SPR"], QNAME = { AUT: "Autumn", WIN: "Winter", SPR: "Spring" }, QS = { AUT: "Aut", WIN: "Win", SPR: "Spr" };
        var CATS = { tt: "Tenure track", teach: "Teaching track", grad: "Grad instructor", other: "Other", unset: "Not set", unassigned: "Unassigned (STAFF, TBA)" };
        var CAT_ORDER = ["tt", "teach", "grad", "other", "unset", "unassigned"];
        var CAT_COLOR = { tt: "#4b2e83", teach: "#9d86d6", grad: "#d9b44a", other: "#6f9fc9", unset: "#e2b6c8", unassigned: "#c9c9cf" };
        var DEFAULTS = { taPerQuarter: 6, coteach: "split", casLower: 10, casUpper: 5 };
        var UNASSIGNED = "Unassigned (STAFF, TBA)";

        /* A saved file (see Save below) opens with its own data and choices, and never reads or writes this browser's storage. */
        var saved = cfg.saved || null;
        /* What's kept in this browser: settings, each instructor's category and FTE (by academic year), budgets, the prefixes,
           and which panels are collapsed. */
        function load(key, fallback){ if(saved) return fallback; try { var v = JSON.parse(localStorage.getItem(key)); return v === null || v === undefined ? fallback : v; } catch(e){ return fallback; } }
        function store(key, v){ if(saved) return; try { localStorage.setItem(key, JSON.stringify(v)); } catch(e){} }
        function withDefaults(s){ var out = Object.assign({}, DEFAULTS); Object.keys(DEFAULTS).forEach(function(k){ if(s && s[k] !== undefined) out[k] = s[k]; }); return out; }
        var settings = withDefaults(load("ftecalc-settings", {}));
        var people = load("ftecalc-people", {});
        var budgets = load("ftecalc-budgets", {});
        var prefixes = load("ftecalc-prefixes", []).filter(function(p){ return cfg.lookup[p]; });
        var view = { ay: cfg.startAY, program: "all", facSort: "cat" };
        var cache = {};
        var HEAD = document.head.outerHTML;   /* this page's head (title and styles), for saved files */
        if(saved){
            settings = withDefaults(saved.settings);
            people = saved.people || {};
            budgets = saved.budgets || {};
            prefixes = saved.prefixes.slice();
            view.ay = saved.ay;
            view.program = saved.program || "all";
            prefixes.forEach(function(p){ var e = cache[saved.ay + "|" + p] = Object.assign({ done: true, at: saved.dataAsOf }, saved.pages[p]); e.ready = Promise.resolve(); });
        }
        /* Loads (and course releases) from earlier versions are no longer used. */
        Object.keys(people).forEach(function(n){ delete people[n].adj; });

        function esc(s){ return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
        function ayLabel(ay){ return ay + "–" + String(ay + 1).slice(2); }
        function quarterYear(q, ay){ return q === "AUT" ? ay : ay + 1; }
        function fmt(n){ return Math.round(n).toLocaleString("en-US"); }
        function f2(n){ return (Math.round(n * 100) / 100).toFixed(2); }
        function money(n){ return "$" + Math.round(n).toLocaleString("en-US"); }
        function andList(xs){ return xs.length > 1 ? xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1] : xs.join(""); }
        function fmtWhen(iso){ var d = new Date(iso); return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }
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
                var s = line.match(/^(?:[A-Za-z]+(?![A-Za-z])\s*)*>?\s*(\d{4,5})\s+([A-Z][A-Z0-9]{0,2})\s+(\S+)(.*)$/), el = line.match(/(\d+)\s*\/\s*(\d+)/);
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
        function loadPrefix(prefix, ay, quiet){
            var key = ay + "|" + prefix;
            if(cache[key]) return cache[key].ready;
            var entry = cache[key] = {};
            entry.ready = Promise.all(QTRS.map(function(q){
                var url = cfg.base + q + quarterYear(q, ay) + "/" + cfg.lookup[prefix];
                if(!quiet) status("Loading " + prefix + " " + QNAME[q] + " " + quarterYear(q, ay) + "…");
                return fetch(url).then(function(r){
                    if(!r.ok) return { status: "missing", lectures: [], quizzes: [], varSkipped: 0 };
                    return r.text().then(function(t){ var pg = parsePage(t, prefix); labelQuizzes(pg); pg.status = pg.lectures.length ? "ok" : "empty"; return pg; });
                }).catch(function(){ return { status: "error", lectures: [], quizzes: [], varSkipped: 0 }; }).then(function(pg){ entry[q] = pg; });
            })).then(function(){ entry.done = true; entry.at = new Date().toISOString(); });
            return entry.ready;
        }

        /* ---- Counting ---- */
        /* A person is kept under their name as the Time Schedule spells it. Over the years a middle initial comes and goes, so a
           name with no record of its own uses the record of the same last and first name ("Smith, John" for "Smith, John A"). */
        function nameKey(n){ var p = n.split(","); return (p[0] + "|" + (p[1] || "").trim().split(/\s+/)[0]).toLowerCase().normalize("NFD").replace(/[^a-z|]/g, ""); }
        var keyIndex = null;
        function rec(name){
            if(people[name]) return people[name];
            if(!keyIndex){ keyIndex = {}; Object.keys(people).forEach(function(n){ var k = nameKey(n); if(!keyIndex[k]) keyIndex[k] = n; }); }
            return name === UNASSIGNED ? undefined : people[keyIndex[nameKey(name)]];
        }
        /* A change is kept under the name itself, starting from what it had (so a second John Smith doesn't change the first). */
        function setRec(name, change){
            var r = Object.assign({}, rec(name), change);
            Object.keys(r).forEach(function(k){ if(r[k] === undefined) delete r[k]; });
            /* An empty record stays when another spelling's record would otherwise take its place. */
            if(Object.keys(r).length || rec(name) !== people[name]) people[name] = r; else delete people[name];
            keyIndex = null;
            store("ftecalc-people", people);
        }
        function catOf(name){ var p = rec(name); return p && CATS[p.cat] && p.cat !== "unassigned" ? p.cat : "unset"; }
        /* A person's FTE in an academic year: 1 unless it's been changed (0 for courses with no instructor named). A change
           applies from its year on, until a later one. Their courses are noted but don't change it. */
        function fteAt(name, ay){
            var f = (rec(name) || {}).fte, at = { v: name === UNASSIGNED ? 0 : 1, since: null };
            if(f) Object.keys(f).map(Number).sort(function(a, b){ return a - b; }).forEach(function(y){ if(y <= ay) at = { v: +f[y], since: y }; });
            return at;
        }
        function setFte(name, ay, v){
            var f = Object.assign({}, (rec(name) || {}).fte), prev = name === UNASSIGNED ? 0 : 1;
            f[ay] = v;
            /* Only the changes are kept: a year that repeats the one before it goes. */
            Object.keys(f).map(Number).sort(function(a, b){ return a - b; }).forEach(function(y){ if(+f[y] === prev) delete f[y]; else prev = +f[y]; });
            setRec(name, { fte: Object.keys(f).length ? f : undefined });
        }
        /* "0.5", ".5", "1/2", "½" or "50%" → 0.5, to two decimals; null for anything that isn't an FTE from 0 to 1. */
        function parseFte(s){
            s = String(s).trim().replace(/[½⅓⅔¼¾⅕⅙]/g, function(c){ return { "½": "1/2", "⅓": "1/3", "⅔": "2/3", "¼": "1/4", "¾": "3/4", "⅕": "1/5", "⅙": "1/6" }[c]; });
            var m = s.match(/^(\d*\.?\d+)\s*(?:\/\s*(\d*\.?\d+)|(%))?$/), v = m ? (m[2] ? +m[1] / +m[2] : m[3] ? +m[1] / 100 : +m[1]) : NaN;
            return isFinite(v) && v >= 0 && v <= 1 ? Math.round(v * 100) / 100 : null;
        }
        function mostCommon(values, prefer){
            var n = {};
            values.forEach(function(v){ n[v] = (n[v] || 0) + 1; });
            return Object.keys(n).map(Number).sort(function(a, b){ return n[b] - n[a] || Math.abs(a - prefer) - Math.abs(b - prefer) || b - a; })[0];
        }
        /* Everything for one set of prefixes. A "course" for load is a lecture section, except that sections in the same quarter
           with the same instructors, days, time and room (combined 4xx/5xx sections, joint listings) count once. A co-taught
           course's SCH is split evenly among its instructors (after Ben Marwick); the course itself is split too, unless
           Settings counts it in full for each. */
        function analyze(set, ay, bare){
            var a = { ay: ay, quarters: {}, lectures: [], quizzes: [], varSkipped: 0, persons: [], sch: 0, schByQ: {}, loading: false };
            var rank = ["missing", "error", "empty", "ok"];
            QTRS.forEach(function(q){ a.quarters[q] = "missing"; a.schByQ[q] = 0; });
            set.forEach(function(p){
                var c = cache[ay + "|" + p];
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
                var names = g.who.length ? g.who : [UNASSIGNED], n = g.who.length || 1;
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
            if(bare) return a;
            /* Someone who teaches in more than one of the programs loaded has their FTE shared by their courses: with 1 of
               5.5 courses in CLAS, CLAS counts 1 ÷ 5.5 of it. A joint course counts in each of its programs, as its SCH does. */
            var whole = {};
            if(set.length < prefixes.length) analyze(prefixes, ay, true).persons.forEach(function(p){ whole[p.name] = p.count; });
            a.persons.forEach(function(p){
                var at = fteAt(p.name, ay);
                p.appt = at.v;
                p.since = at.since;
                p.allCount = whole[p.name] || p.count;
                p.share = Math.min(1, p.count / p.allCount);
                p.fte = p.appt * p.share;
            });
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
            a.tas = taEstimate(a.lectures, a.quizzes, ay);
            a.taPositions = a.tas.reduce(function(s, t){ return s + t.tas; }, 0);
            a.taFte = a.taPositions / settings.taPerQuarter;
            a.taStudents = a.tas.reduce(function(s, t){ return s + t.students; }, 0);
            return a;
        }
        /* TAs per course and quarter, estimated from quiz sections as in TimeScheduleMod: named TAs, plus sections with students
           but no TA at the course's usual load (sections per TA), after topping up named TAs who have fewer; empty sections
           aren't counted. A TA's load counts their quiz sections in the quarter across everything loaded. */
        function taEstimate(lectures, quizzes, ay){
            var rows = [];
            QTRS.forEach(function(q){
                var all = [];
                prefixes.forEach(function(p){ var c = cache[ay + "|" + p]; if(c && c[q]) all = all.concat(c[q].quizzes); });
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
        if(saved) ayOptions.push(saved.ay);
        else for(var y = cfg.newestAY || cfg.startAY; y > cfg.startAY - 7; y--) ayOptions.push(y);
        var ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13.5h11"/></svg>';
        var PANELS = [["programs", "Programs compared", "how each program uses its teaching resources"], ["faculty", "Faculty and instructors", "each person’s FTE and courses; a name opens their history"], ["tas", "TA allocation", "students per TA, by course and quarter"]];
        document.body.innerHTML = "<header><h1>FTECalc</h1>"
            + "<span class='ctl'>Academic year <select id='ay' aria-label='Academic year'" + (saved ? " disabled title='A saved file keeps one academic year'" : "") + ">" + ayOptions.map(function(y){ return "<option value='" + y + "'>" + ayLabel(y) + " (Aut, Win, Spr)</option>"; }).join("") + "</select></span>"
            + "<span class='ctl'>Program <select id='program' aria-label='Program' title='Show one program throughout the page'><option value='all'>All programs</option></select></span>"
            + "<button type='button' id='save-btn' disabled title='Add a prefix first'>" + ICON + "Save</button>"
            + "<button type='button' id='settings-btn' aria-expanded='false' aria-controls='settings' aria-label='Settings' title='Settings'>⚙</button>"
            + "<div id='settings' hidden></div></header>"
            + (saved ? "<div class='saved-banner'><span class='saved-tag'>SAVED</span>" + (saved.note ? "<span class='saved-note'>" + esc(saved.note) + "</span>" : "")
                + "<span class='saved-meta'>" + ayLabel(saved.ay) + " · " + esc(saved.prefixes.join(", ")) + (saved.dataAsOf ? " · data as of " + esc(fmtWhen(saved.dataAsOf)) : "") + "</span>"
                + "<span class='saved-right' title='This file keeps the numbers and choices from when it was saved. Changes made here aren’t kept. Run FTECalc on the Time Schedule for today’s numbers.'>Saved " + esc(fmtWhen(saved.savedAt)) + " · numbers don’t update</span></div>" : "")
            + "<div class='bar'><strong>Prefixes</strong><span id='chips'></span><input id='prefix-input' placeholder='Add a prefix, e.g. PHIL' spellcheck='false' autocomplete='off' title='One or more course prefixes, comma-separated; each prefix is a program'><span id='load-status'></span></div>"
            + "<div class='summary' id='summary'></div>"
            + PANELS.map(function(x){
                return "<div class='panel' id='panel-" + x[0] + "'><h2><button type='button' class='panel-toggle' data-panel='" + x[0] + "' aria-expanded='true' aria-controls='" + x[0] + "' title='Collapse or expand this section'><span class='chev'>▼</span>" + x[1] + "</button>"
                    + " <span class='sub'>" + x[2] + "</span></h2><div class='body' id='" + x[0] + "'></div></div>";
            }).join("")
            + "<footer>Reads only the Time Schedule’s section listings: no student data, and TAs are counted, never named. " + (saved ? "Categories, FTEs and budgets are as saved. " : "Categories, FTEs and budgets stay in this browser. ") + "Summer is never counted. "
            + "<span title='Past quarters show final enrollment. UW’s official SCH uses 10th-day counts, so these figures are close but not identical.'>Enrollment is live.</span></footer>";

        if(saved) document.body.classList.add("is-saved");
        document.getElementById("ay").value = String(view.ay);
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
            var unsetNote = a.unset ? "<div><button type='button' class='linkish' data-goto='faculty' title='Set them in the Faculty table to see FTE and SCH by category'>" + plural(a.unset, "instructor") + " without a category</button></div>" : "";
            document.getElementById("summary").innerHTML =
                sect("Student credit hours", fmt(a.sch), QTRS.map(function(q){ return QS[q] + " <b>" + (a.quarters[q] === "ok" ? fmt(a.schByQ[q]) : "–") + "</b>"; }).join(" · ") + partial
                    + (a.varSkipped ? "<div class='note' title='Sections whose credits are listed as VAR have no fixed credits, so they’re left out'>" + plural(a.varSkipped, "variable-credit section") + " not counted</div>" : ""))
                + sect("Instructional FTE", f2(a.instrFte + a.taFte), fteParts.join(" · ") + unsetNote)
                + sect("SCH per FTE", a.instrFte ? fmt(a.sch / a.instrFte) + "<small>per instructor FTE</small>" : "–", a.instrFte + a.taFte ? "<b>" + fmt(a.sch / (a.instrFte + a.taFte)) + "</b> counting TAs too" : "")
                + sect("Cost per SCH", budget && budgetSch ? money(budget / budgetSch) : "–", budget ? "instructional (GOF) budget <b>" + money(budget) + "</b> ÷ SCH <button type='button' class='pill-btn' data-open='settings'>Edit budget</button>"
                    : "<button type='button' class='pill-btn' data-open='settings'>Add the instructional (GOF) budget</button>");
        }
        var analyzed = {};
        function analyzeCached(p){ var k = view.ay + "|" + p; return analyzed[k] || (analyzed[k] = analyze([p], view.ay)); }
        function renderPrograms(){
            if(!prefixes.length){ document.getElementById("programs").innerHTML = "<div class='empty'>Add one or more course prefixes above. Each prefix is a program.</div>"; return; }
            var rows = prefixes.map(function(p){ return { name: p, a: analyzeCached(p), budget: +budgets[p] || 0 }; });
            if(prefixes.length > 1) rows.push({ name: "All programs", a: analyze(prefixes, view.ay), budget: prefixes.reduce(function(s, p){ return s + (+budgets[p] || 0); }, 0), total: true });
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
            var th = function(key, label, cls, tip){ return "<th" + (cls ? " class='" + cls + "'" : "") + (key ? " data-sort='" + key + "'" : "") + (tip || key ? " title='" + (tip || "Sort") + "'" : "") + ">" + label + (view.facSort === key ? " ▾" : "") + "</th>"; };
            var program = view.program === "all" ? "" : view.program;
            el.innerHTML = "<table><thead><tr>" + th("name", "Instructor") + th("cat", "Category")
                + th("fte", "FTE", "n", "Each person counts 1 FTE unless you change it: type 0.5, 1/3, ¾ and so on. A change applies from this year on. Click to sort.") + QTRS.map(function(q){ return "<th>" + QS[q] + "</th>"; }).join("")
                + "<th class='n' title='Courses taught this year. They’re noted, but don’t change FTE.'>Courses</th>" + th("sch", "SCH", "n") + "<th class='n' title='Students per course; combined sections count as one class'>Avg<br>class</th><th>Balance</th></tr></thead><tbody>"
                + ps.map(function(p){
                    var un = p.cat === "unassigned";
                    var catCell = un ? "<span class='dim'>STAFF or TBA</span>" : "<select class='cat" + (p.cat === "unset" ? " unset" : "") + "' data-person='" + esc(p.name) + "' aria-label='Category for " + esc(p.name) + "'>"
                        + ["unset", "tt", "teach", "grad", "other"].map(function(c){ return "<option value='" + c + "'" + (c === p.cat ? " selected" : "") + ">" + (c === "unset" ? "Not set" : CATS[c]) + "</option>"; }).join("") + "</select>";
                    var two = function(x){ return Math.round(x * 100) / 100; };
                    var fteTip = (p.since === null ? (un ? "Courses with no instructor named count no FTE. Give them some, e.g. for a lecturer still to be hired."
                        : "1 FTE, as everyone is unless changed.") : f2(p.appt) + " since " + ayLabel(p.since) + ".") + " A change applies from " + ayLabel(view.ay) + " on.";
                    var fteCell = "<input class='fte" + (p.since === null ? "" : " set") + "' inputmode='decimal' data-fte='" + esc(p.name) + "' value='" + f2(p.appt) + "' title='" + esc(fteTip) + "' aria-label='FTE for " + esc(p.name) + " in " + ayLabel(view.ay) + "'>"
                        + (p.share < 1 ? "<span class='share dim' title='" + esc(p.name + " teaches " + two(p.allCount) + " courses in the prefixes loaded, " + two(p.count) + " of them in " + program + ", so " + program + " counts " + f2(p.fte) + " of their " + f2(p.appt) + " FTE.") + "'>" + f2(p.fte) + " here</span>" : "");
                    var cells = QTRS.map(function(q){ return "<td>" + (a.quarters[q] !== "ok" && a.quarters[q] !== "empty" ? "<span class='cc none' title='" + (a.loading ? "Loading" : a.quarters[q] === "error" ? "Couldn’t be read" : "Not published yet") + "'>…</span>" : p.courses[q].length ? p.courses[q].map(function(c){ return chipHtml(p, c.g, c); }).join("") : "<span class='cc none'>–</span>") + "</td>"; }).join("");
                    var who = un || saved ? esc(p.name) : "<button type='button' class='who' data-history='" + esc(p.name) + "' title='" + esc(p.name) + "’s teaching history, every year the Time Schedule has'>" + esc(p.name) + "</button>";
                    return "<tr" + (un ? " class='unassigned'" : "") + "><td class='name'>" + who + "</td><td>" + catCell + "</td><td class='n'>" + fteCell + "</td>" + cells
                        + "<td class='n'>" + two(p.count) + "</td><td class='n'>" + fmt(p.sch) + "</td><td class='n'>" + (p.classes ? Math.round(p.students / p.classes) : "–") + "</td><td>" + (un ? "" : balance(p)) + "</td></tr>";
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
            document.getElementById("settings").innerHTML = "<div class='set-head'>Counting</div><div class='set-grid'>"
                + num("taPerQuarter", "TA FTE: one quarter is 1 ÷", settings.taPerQuarter, "min='1' max='12'")
                + "<label>Co-taught courses <select id='coteach'><option value='split'" + (settings.coteach === "split" ? " selected" : "") + ">split between instructors</option><option value='full'" + (settings.coteach === "full" ? " selected" : "") + ">count in full for each</option></select></label></div>"
                + "<div class='set-head'>CAS minimum enrollment (⚠ on a course)</div><div class='set-grid'>" + num("casLower", "100–300 level", settings.casLower, "min='0'") + num("casUpper", "400–500 level", settings.casUpper, "min='0'") + "</div>"
                + "<div class='set-head'>Instructional (GOF) budget, for cost per SCH</div>" + (prefixes.length ? prefixes.map(function(p){ return "<div class='budget'><span>" + esc(p) + "</span><input type='number' min='0' step='1000' data-budget='" + esc(p) + "' value='" + (budgets[p] || "") + "' placeholder='$'></div>"; }).join("") : "<p class='set-note'>Add a prefix first.</p>")
                + "<p class='set-note'>" + (saved ? "Changes here aren’t kept in the saved file." : "Kept in this browser only.") + " Categories and each person’s FTE are set in the Faculty table.</p><button type='button' class='pill-btn' id='reset'>Reset to defaults</button>";
        }
        function render(){
            analyzed = {};
            renderChips();
            var a = analyze(view.program === "all" ? prefixes : [view.program], view.ay);
            document.title = "FTECalc " + ayLabel(view.ay) + (saved ? " · saved" + (saved.note ? " · " + saved.note : "") : "");
            var saveBtn = document.getElementById("save-btn"), busy = prefixes.some(function(p){ var c = cache[view.ay + "|" + p]; return !c || !c.done; });
            saveBtn.disabled = !prefixes.length || busy;
            saveBtn.title = !prefixes.length ? "Add a prefix first" : busy ? "Loading…" : "Save these results as a file that opens without the Time Schedule";
            renderSummary(a);
            renderPrograms();
            renderFaculty(a);
            renderTAs(a);
        }
        function loadAll(){
            if(!prefixes.length || saved){ status(""); render(); return; }
            Promise.all(prefixes.map(function(p){ return loadPrefix(p, view.ay); })).then(function(){
                var failed = [];
                prefixes.forEach(function(p){ QTRS.forEach(function(q){ var c = cache[view.ay + "|" + p]; if(c[q] && c[q].status === "error") failed.push(p + " " + QS[q]); }); });
                if(failed.length) status("Couldn’t read " + failed.join(", ") + ". Still signed in to UW? Reload the Time Schedule, then FTECalc.", true);
                else status("");
                render();
            });
            render();
        }

        /* ---- A person's history ----
           Every academic year the Time Schedule has, for the prefixes loaded, read back from the newest until two years in a
           row have no pages: after a colleague's one-page teaching history, with no salary. A person's courses are
           found under each spelling of their last and first name ("Smith, John A" and "Smith, John"); more names can be added,
           e.g. after a name change, and a match that isn't them dropped. Only whole academic years count, never summer. Years
           are grouped into periods of one, two or three, ending with the latest, and the first period is compared with the
           last, per year taught. Print gives a one-page report (or a PDF). */
        var hist = null;
        function openHistory(name){
            closeHistory();
            hist = { name: name, group: +load("ftecalc-history-group", 3) || 3, years: [], partial: [], errors: [], misses: 0, next: cfg.newestAY || cfg.startAY, loading: true };
            var el = document.createElement("div");
            el.id = "history";
            el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-labelledby", "hist-title");
            el.innerHTML = "<div class='hist-bar'><button type='button' class='hist-back'>‹ Back to " + ayLabel(view.ay) + "</button><span>Periods</span><span class='picks'>"
                + [1, 2, 3].map(function(n){ return "<button type='button' data-group='" + n + "'>" + plural(n, "year") + "</button>"; }).join("") + "</span>"
                + "<button type='button' class='pill-btn hist-print' title='Print this page, or save it as a PDF from the print dialog'>Print</button></div>"
                + "<div class='hist-page'><h2 id='hist-title'>" + esc(name) + "<small>Teaching history</small></h2><div class='hist-sub' id='hist-sub'></div>"
                + "<div class='hist-names'><span>Found as</span><span id='hist-chips'></span><input id='hist-add' list='hist-all' placeholder='Add another name' title='Another name they taught under, e.g. before a name change' spellcheck='false' autocomplete='off' aria-label='Add another name'><datalist id='hist-all'></datalist></div>"
                + "<div id='hist-note' role='status'></div><div id='hist-body'></div></div>";
            document.body.appendChild(el);
            document.body.classList.add("hist-open");
            el.addEventListener("click", function(e){
                var t = e.target;
                if(t.closest(".hist-back")) return closeHistory();
                if(t.closest(".hist-print")) return window.print();
                var g = t.closest("[data-group]"), drop = t.closest("[data-drop]");
                if(g){ hist.group = +g.getAttribute("data-group"); store("ftecalc-history-group", hist.group); renderHistory(); }
                if(drop) changeNames(drop.getAttribute("data-drop"), false);
            });
            var add = el.querySelector("#hist-add");
            var addName = function(){
                var n = add.value.trim(), found = historyNames().all.filter(function(x){ return x.toLowerCase() === n.toLowerCase(); })[0];
                add.classList.toggle("bad", !!n && !found);
                add.title = n && !found ? "No one by that name in these years" : "Another name they taught under, e.g. before a name change";
                if(found){ add.value = ""; changeNames(found, true); }
            };
            /* Enter in a box with suggestions doesn't count as a change in Chrome, so it's handled too. */
            add.addEventListener("change", addName);
            add.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); addName(); } });
            add.addEventListener("input", function(){ add.classList.remove("bad"); });
            renderHistory();
            el.querySelector(".hist-back").focus();
            readBack(hist);
        }
        function closeHistory(){
            var el = document.getElementById("history");
            if(el) el.remove();
            document.body.classList.remove("hist-open");
            hist = null;
        }
        document.addEventListener("keydown", function(e){ if(e.key === "Escape" && hist) closeHistory(); });
        /* Two years at a time, newest first. Pages that couldn't be read before are tried again. */
        function readBack(h){
            if(h !== hist) return;
            if(h.next < 1990 || h.errors.length || h.misses >= (h.years.length || h.partial.length ? 2 : 3)){ h.loading = false; return renderHistory(); }
            var batch = [h.next, h.next - 1];
            h.next -= 2;
            batch.forEach(function(y){ prefixes.forEach(function(p){ var c = cache[y + "|" + p]; if(c && c.done && QTRS.some(function(q){ return c[q].status === "error"; })) delete cache[y + "|" + p]; }); });
            Promise.all(batch.map(function(y){ return Promise.all(prefixes.map(function(p){ return loadPrefix(p, y, true); })); })).then(function(){
                if(h !== hist) return;
                batch.forEach(function(y){
                    var st = function(q){ return prefixes.map(function(p){ return cache[y + "|" + p][q].status; }); };
                    var all = [].concat.apply([], QTRS.map(st));
                    if(all.indexOf("error") !== -1) h.errors.push(y);
                    else if(all.every(function(x){ return x === "missing"; })) h.misses++;
                    else {
                        h.misses = 0;
                        (QTRS.every(function(q){ return st(q).some(function(x){ return x !== "missing"; }); }) ? h.years : h.partial).push(y);
                    }
                });
                renderHistory();
                readBack(h);
            });
        }
        /* Every instructor named in the years read, and which of them are this person: the name itself, other spellings of it
           (unless dropped), and names added. */
        function historyNames(){
            var r = rec(hist.name) || {}, k = nameKey(hist.name), all = {}, names = {};
            hist.years.concat(hist.partial).forEach(function(y){
                prefixes.forEach(function(p){ var c = cache[y + "|" + p]; QTRS.forEach(function(q){ (c && c[q] ? c[q].lectures : []).forEach(function(l){ l.who.forEach(function(n){ all[n] = true; }); }); }); });
            });
            Object.keys(all).forEach(function(n){ if(nameKey(n) === k && (r.notAka || []).indexOf(n) === -1) names[n] = "spelling"; });
            (r.aka || []).forEach(function(n){ names[n] = "added"; });
            names[hist.name] = "self";
            return { all: Object.keys(all).sort(), names: names };
        }
        function changeNames(n, add){
            var r = rec(hist.name) || {}, aka = (r.aka || []).filter(function(x){ return x !== n; }), not = (r.notAka || []).filter(function(x){ return x !== n; });
            if(add) aka.push(n); else if(nameKey(n) === nameKey(hist.name)) not.push(n);
            setRec(hist.name, { aka: aka.length ? aka : undefined, notAka: not.length ? not : undefined });
            renderHistory();
        }
        /* One academic year for this person: their courses (labels), course count, classes, students, SCH and FTE, beside
           everyone's SCH and instructor FTE that year. */
        function historyYear(y, names){
            var a = analyze(prefixes, y), multi = prefixes.length > 1;
            var o = { ay: y, count: 0, classes: 0, students: 0, sch: 0, fte: 0, courses: [], allSch: a.sch, allFte: a.instrFte };
            a.persons.forEach(function(p){
                if(!names[p.name]) return;
                o.count += p.count; o.classes += p.classes; o.students += p.students; o.sch += p.sch;
                o.fte = Math.max(o.fte, p.fte);
                QTRS.forEach(function(q){ p.courses[q].forEach(function(c){ o.courses.push(c.g.sections.map(function(l){ return (multi ? l.prefix + " " : "") + l.number; }).join("/") + (c.share < 1 ? (c.share === 0.5 ? "½" : " (" + f2(c.share) + ")") : "")); }); });
            });
            return o;
        }
        function niceStep(max){
            var raw = max / 3, mag = Math.pow(10, Math.floor(Math.log10(raw)));
            return [1, 2, 2.5, 5, 10].map(function(m){ return m * mag; }).filter(function(v){ return v >= raw; })[0];
        }
        function compact(v){ return v >= 1000 ? (Math.round(v / 100) / 10) + "K" : String(v); }
        /* SCH each year as columns, on the periods' bands; the first and last values labelled, the rest on hover. */
        function historyChart(ys, periods){
            var W = 900, x0 = 40, top = 22, base = 122, n = ys.length, slot = (W - x0) / n, bw = Math.min(24, slot - 2);
            var max = Math.max.apply(null, ys.map(function(o){ return o.sch; }).concat([1])), step = niceStep(max), ymax = Math.ceil(max / step) * step;
            var Y = function(v){ return base - (base - top) * v / ymax; }, out = "", i = 0;
            periods.forEach(function(p, k){
                var x = x0 + i * slot, w = p.years.length * slot;
                if(periods.length > 1 && k % 2 === 0 && periods.some(function(q){ return q.years.length > 1; })) out += "<rect x='" + x + "' y='" + (top - 14) + "' width='" + w + "' height='" + (base - top + 14) + "' fill='#f6f4fa'/>";
                if(w >= 56 || k % Math.ceil(56 / w) === 0) out += "<text x='" + (x + w / 2) + "' y='" + (base + 17) + "' text-anchor='middle' font-size='11' fill='#666'>" + p.label + "</text>";
                i += p.years.length;
            });
            for(var v = 0; v <= ymax; v += step) out += "<line x1='" + x0 + "' x2='" + W + "' y1='" + Y(v) + "' y2='" + Y(v) + "' stroke='" + (v ? "#ebe8f0" : "#c9c4d4") + "' stroke-width='1'/><text x='" + (x0 - 6) + "' y='" + (Y(v) + 4) + "' text-anchor='end' font-size='11' fill='#777'>" + compact(v) + "</text>";
            var taught = ys.filter(function(o){ return o.count; }), ends = taught.length ? [taught[0].ay, taught[taught.length - 1].ay] : [];
            ys.forEach(function(o, k){
                var cx = x0 + (k + 0.5) * slot, x = cx - bw / 2, y = Y(o.sch), r = Math.min(4, base - y);
                if(o.sch > 0) out += "<path d='M" + x + "," + base + "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y + "H" + (x + bw - r) + "Q" + (x + bw) + "," + y + " " + (x + bw) + "," + (y + r) + "V" + base + "Z' fill='#4b2e83'/>";
                if(ends.indexOf(o.ay) !== -1) out += "<text x='" + cx + "' y='" + (y - 5) + "' text-anchor='middle' font-size='11' font-weight='600' fill='#2e1a5c'>" + fmt(o.sch) + "</text>";
                out += "<rect x='" + (x0 + k * slot) + "' y='" + (top - 14) + "' width='" + slot + "' height='" + (base - top + 14) + "' fill='transparent'><title>" + esc(ayLabel(o.ay) + ": " + (o.count ? fmt(o.sch) + " SCH · " + plural(Math.round(o.count * 100) / 100, "course") + " · " + plural(o.students, "student") : "no courses")) + "</title></rect>";
            });
            return "<svg class='hist-chart' viewBox='0 0 " + W + " " + (base + 24) + "' role='img' aria-label='SCH each academic year'>" + out + "</svg>";
        }
        function renderHistory(){
            var h = hist;
            if(!h) return;
            var found = historyNames(), names = found.names;
            document.querySelectorAll("#history [data-group]").forEach(function(b){ b.classList.toggle("on", +b.getAttribute("data-group") === h.group); });
            document.getElementById("hist-chips").innerHTML = Object.keys(names).sort().map(function(n){
                return "<span class='chip" + (names[n] === "self" ? " self" : "") + "'>" + esc(n) + (names[n] === "self" ? "" : "<button type='button' data-drop='" + esc(n) + "' aria-label='Not " + esc(h.name) + ": leave out " + esc(n) + "' title='" + (names[n] === "added" ? "Added by you. " : "Another spelling of the name. ") + "Not the same person? Leave it out.'>×</button>") + "</span>";
            }).join(" ");
            document.getElementById("hist-all").innerHTML = found.all.filter(function(n){ return !names[n]; }).map(function(n){ return "<option value='" + esc(n) + "'>"; }).join("");
            var ys = h.years.slice().sort(function(a, b){ return a - b; }).map(function(y){ return historyYear(y, names); });
            var taught = ys.filter(function(o){ return o.count; });
            var note = h.loading ? "Reading the Time Schedule, newest first: " + (h.years.length + h.partial.length ? "back to " + ayLabel(Math.min.apply(null, h.years.concat(h.partial))) + "…" : "…") : "";
            if(!h.loading && h.partial.length) note = h.partial.map(ayLabel).join(", ") + " isn’t included until all of Autumn, Winter and Spring are published.";
            if(h.errors.length) note = "Couldn’t read " + ayLabel(h.errors[0]) + ", so the history stops there. Still signed in to UW? Reload the Time Schedule, then FTECalc.";
            var noteEl = document.getElementById("hist-note");
            noteEl.textContent = note;
            noteEl.classList.toggle("warn", !!h.errors.length);
            var read = h.years.length ? ayLabel(ys[0].ay) + " to " + ayLabel(ys[ys.length - 1].ay) : "";
            if(taught.length) ys = ys.filter(function(o){ return o.ay >= taught[0].ay && o.ay <= taught[taught.length - 1].ay; });
            document.getElementById("hist-sub").innerHTML = esc(prefixes.join(", ")) + (taught.length ? " · " + ayLabel(ys[0].ay) + " to " + ayLabel(ys[ys.length - 1].ay) : "") + " · Autumn, Winter and Spring";
            var body = document.getElementById("hist-body");
            if(!taught.length){ body.innerHTML = h.loading ? "" : "<div class='empty'>No courses found for " + esc(h.name) + " in " + esc(prefixes.join(", ")) + (read ? ", " + read : "") + ".</div>"; return; }
            var periods = [];
            for(var i = ys.length; i > 0; i -= h.group) periods.unshift(ys.slice(Math.max(0, i - h.group), i));
            var sum = function(list){
                var p = { years: list, from: list[0].ay, to: list[list.length - 1].ay, taught: 0, count: 0, classes: 0, students: 0, sch: 0, fteYears: 0, allSch: 0, allFte: 0, courses: {}, off: [] };
                list.forEach(function(o){
                    if(o.count){ p.taught++; p.fteYears += o.fte; } else p.off.push(ayLabel(o.ay));
                    ["count", "classes", "students", "sch", "allSch", "allFte"].forEach(function(k){ p[k] += o[k]; });
                    o.courses.forEach(function(c){ p.courses[c] = (p.courses[c] || 0) + 1; });
                });
                p.label = p.from === p.to ? ayLabel(p.from) : p.from + "–" + String(p.to + 1).slice(2);
                return p;
            };
            periods = periods.map(sum);
            var all = sum(ys), two = function(x){ return Math.round(x * 100) / 100; };
            var per = function(p){ var t = p.taught || 1; return { courses: p.count / t, students: p.students / t, avg: p.classes ? p.students / p.classes : 0, sch: p.sch / t, perFte: p.fteYears ? p.sch / p.fteYears : 0 }; };
            var tiles = "";
            if(periods.length > 1){
                var a = per(periods[0]), b = per(periods[periods.length - 1]), first = periods[0].label, last = periods[periods.length - 1].label;
                var tile = function(label, k, show, tip){
                    var d = a[k] ? Math.round((b[k] - a[k]) / a[k] * 100) : null;
                    return "<div class='tile' title='" + esc(tip + " " + first + " → " + last + ".") + "'><div class='tl'>" + label + "</div><div class='tv'>" + show(a[k]) + " → <b>" + show(b[k]) + "</b></div><div class='td'>" + (d === null ? "–" : d === 0 ? "no change" : (d > 0 ? "▲ " : "▼ ") + Math.abs(d) + "%") + "</div></div>";
                };
                tiles = "<div class='tiles-head'>" + first + " → " + last + ", per year taught</div><div class='tiles'>"
                    + tile("Courses a year", "courses", two, "Courses each year they taught,") + tile("Students a year", "students", fmt, "Students each year they taught,")
                    + tile("Average class", "avg", fmt, "Students per course; combined sections count as one class,") + tile("SCH a year", "sch", fmt, "Student credit hours each year they taught,")
                    + tile("SCH per FTE", "perFte", fmt, "SCH ÷ their FTE in the years they taught,") + "</div>";
            }
            var cell = function(v){ return "<td class='n'>" + v + "</td>"; };
            var row = function(p, total){
                var list = Object.keys(p.courses).sort(function(x, y){ return x.localeCompare(y, "en", { numeric: true }); }).map(function(c){ return esc(c) + (p.courses[c] > 1 ? " ×" + p.courses[c] : ""); });
                return "<tr class='" + (total ? "total" : p.taught ? "" : "off") + "'><td class='name'>" + (total ? "All, " + p.label : p.label) + "</td>"
                    + (h.group > 1 ? cell(p.off.length ? "<span title='No courses in " + esc(andList(p.off)) + "'>" + p.taught + " of " + p.years.length + "</span>" : p.taught + " of " + p.years.length) : "")
                    + (p.taught ? cell(two(p.count)) + cell(fmt(p.students)) + cell(p.classes ? fmt(p.students / p.classes) : "–") + cell(fmt(p.sch)) + cell(f2(p.fteYears / p.taught)) + cell(p.fteYears ? fmt(p.sch / p.fteYears) : "–")
                        : cell("–") + cell("–") + cell("–") + cell("–") + cell("–") + cell("–"))
                    + cell(p.allFte ? fmt(p.allSch / p.allFte) : "–") + "<td class='list'>" + (list.length ? list.join(" · ") : "No courses") + "</td></tr>";
            };
            body.innerHTML = tiles + historyChart(ys, periods)
                + "<table class='hist-table'><thead><tr><th>" + (h.group > 1 ? "Period" : "Year") + "</th>" + (h.group > 1 ? "<th class='n'>Years<br>taught</th>" : "")
                + "<th class='n'>Courses</th><th class='n'>Students</th><th class='n' title='Students per course; combined sections count as one class'>Avg<br>class</th><th class='n'>SCH</th>"
                + "<th class='n' title='Their FTE, averaged over the years they taught'>FTE</th><th class='n'>SCH per<br>FTE</th>"
                + "<th class='n' title='SCH per instructor FTE for everyone teaching in " + esc(prefixes.join(", ")) + " in the same years'>Everyone’s<br>SCH per FTE</th><th>Courses taught</th></tr></thead><tbody>"
                + periods.map(function(p){ return row(p); }).join("") + (periods.length > 1 ? row(all, true) : "") + "</tbody></table>";
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
            if(t.matches("select.cat")){ setRec(t.getAttribute("data-person"), { cat: t.value }); render(); }
            if(t.matches("input.fte")){
                var v = parseFte(t.value);
                if(v !== null) setFte(t.getAttribute("data-fte"), view.ay, v);
                render();
            }
        });
        document.getElementById("faculty").addEventListener("focusin", function(e){ if(e.target.matches("input.fte")) e.target.select(); });
        document.getElementById("faculty").addEventListener("click", function(e){
            var th = e.target.closest("th[data-sort]"), who = e.target.closest("[data-history]");
            if(th){ view.facSort = th.getAttribute("data-sort"); render(); }
            if(who) openHistory(who.getAttribute("data-history"));
        });
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
        box.addEventListener("click", function(e){ if(e.target.id === "reset"){ settings = withDefaults({}); store("ftecalc-settings", settings); renderSettings(); render(); } });
        document.getElementById("summary").addEventListener("click", function(e){
            if(e.target.closest("[data-open='settings']")) return showSettings(true);
            if(e.target.closest("[data-goto='faculty']")) document.getElementById("panel-faculty").scrollIntoView({ behavior: "smooth", block: "start" });
        });
        /* Collapsible panels, as in MyGradMod; remembered in this browser. */
        var collapsed = load("ftecalc-collapsed", {});
        function setCollapsed(key, on){
            collapsed[key] = on;
            document.getElementById("panel-" + key).classList.toggle("collapsed", on);
            document.querySelector(".panel-toggle[data-panel='" + key + "']").setAttribute("aria-expanded", String(!on));
            store("ftecalc-collapsed", collapsed);
        }
        PANELS.forEach(function(x){ if(collapsed[x[0]]) setCollapsed(x[0], true); });
        document.querySelectorAll(".panel-toggle").forEach(function(b){ b.addEventListener("click", function(){ var k = b.getAttribute("data-panel"); setCollapsed(k, !collapsed[k]); }); });

        /* ---- Save ----
           Saves the year's results as one HTML file that reopens this dashboard without the Time Schedule: the sections read
           (instructor names, TAs only as labels), the settings, the categories and FTEs of the people in it, and the budgets.
           Chrome's Save As dialog remembers the folder; other browsers download to Downloads (as in TimeScheduleMod). */
        function dataAsOf(){
            var times = prefixes.map(function(p){ var c = cache[view.ay + "|" + p]; return c && c.at; }).filter(Boolean).sort();
            return times.length ? times[0] : null;
        }
        function fileName(note, iso){
            var d = new Date(iso || Date.now()), pad = function(n){ return String(n).padStart(2, "0"); };
            var stamp = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + pad(d.getMinutes());
            var ps = prefixes.length > 4 ? prefixes.slice(0, 3).join(" ") + " +" + (prefixes.length - 3) : prefixes.join(" ");
            return ("FTECalc " + ayLabel(view.ay) + " " + ps + " " + stamp + (note ? " " + note : "")).replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").trim().slice(0, 150) + ".html";
        }
        function savedHtml(note){
            var pages = {}, names = {};
            prefixes.forEach(function(p){
                var c = cache[view.ay + "|" + p];
                pages[p] = {};
                QTRS.forEach(function(q){ pages[p][q] = c[q]; (c[q] ? c[q].lectures : []).forEach(function(l){ l.who.forEach(function(n){ names[n] = true; }); }); });
            });
            var keep = {}, money = {};
            names[UNASSIGNED] = true;
            Object.keys(names).forEach(function(n){ if(rec(n)) keep[n] = rec(n); });
            prefixes.forEach(function(p){ if(budgets[p]) money[p] = budgets[p]; });
            var data = { version: 1, note: note, savedAt: new Date().toISOString(), dataAsOf: dataAsOf(), ay: view.ay, prefixes: prefixes.slice(), program: view.program,
                settings: settings, people: keep, budgets: money, pages: pages };
            var c = { base: cfg.base, startAY: view.ay, lookup: cfg.lookup, saved: data };
            return "<!DOCTYPE html><html>" + HEAD + "<body><script>(" + app.toString() + ")(" + JSON.stringify(c).replace(/</g, "\\u003c") + ");<\/script></body></html>";
        }
        function download(name, html){
            var url = URL.createObjectURL(new Blob([html], { type: "text/html" })), a = document.createElement("a");
            a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function(){ URL.revokeObjectURL(url); }, 60000);
        }
        function toast(text){
            var t = document.createElement("div");
            t.className = "toast"; t.setAttribute("role", "status"); t.textContent = text;
            document.body.appendChild(t);
            setTimeout(function(){ t.remove(); }, 6000);
        }
        function openSave(){
            if(!prefixes.length) return;
            var old = document.getElementById("save-dialog");
            if(old) old.remove();
            var picks = ["10th day", "End of quarter", "End of year", "Budget request"];
            var dlg = document.createElement("div");
            dlg.id = "save-dialog"; dlg.className = "shade";
            dlg.innerHTML = "<div class='dlg' role='dialog' aria-modal='true' aria-labelledby='save-title'><h2><span id='save-title'>Save results</span><button type='button' class='dlg-x' aria-label='Close'>×</button></h2><div class='dlg-body'>"
                + "<div class='dlg-row'><b>Note</b><div><input id='save-note' maxlength='80' placeholder='e.g. 10th day of Spring' aria-label='Note'><div class='picks'>" + picks.map(function(x){ return "<button type='button'>" + x + "</button>"; }).join("") + "</div></div></div>"
                + "<div class='dlg-row'><b>Data as of</b><div class='dlg-val'><span id='save-when'></span><label class='dlg-check'><input type='checkbox' id='save-reload' checked>Reload from the Time Schedule first, so the time is exact</label></div></div>"
                + "<div class='dlg-row'><b>Includes</b><div class='dlg-val'>" + esc(ayLabel(view.ay) + " · " + prefixes.join(", ")) + ": the totals, and each instructor’s courses, category and FTE. <span class='dim'>Share it only with people who should see instructors’ teaching.</span></div></div>"
                + "<div class='dlg-row'><b>File</b><div class='dlg-file' id='save-file'></div></div><div class='dlg-status' id='save-status' role='status'></div></div>"
                + "<div class='dlg-foot'><button type='button' class='dlg-cancel'>Cancel</button><button type='button' class='dlg-save'>" + ICON + (window.showSaveFilePicker ? "Save file…" : "Save file") + "</button></div></div>";
            document.body.appendChild(dlg);
            var note = dlg.querySelector("#save-note"), reload = dlg.querySelector("#save-reload"), saving = false;
            var asOf = dataAsOf();
            dlg.querySelector("#save-when").textContent = asOf ? fmtWhen(asOf) : "–";
            var refresh = function(){
                dlg.querySelector("#save-file").textContent = fileName(note.value.trim(), reload.checked ? null : asOf);
                dlg.querySelectorAll(".picks button").forEach(function(b){ b.classList.toggle("on", b.textContent === note.value); });
            };
            var onKey = function(e){ if(e.key === "Escape") close(); };
            var close = function(){ if(saving) return; dlg.remove(); document.removeEventListener("keydown", onKey); };
            var setStatus = function(t, err){ var el = dlg.querySelector("#save-status"); el.textContent = t; el.classList.toggle("err", !!err); };
            document.addEventListener("keydown", onKey);
            dlg.addEventListener("click", function(e){ if(e.target === dlg || e.target.closest(".dlg-x, .dlg-cancel")) close(); });
            dlg.querySelectorAll(".picks button").forEach(function(b){ b.addEventListener("click", function(){ note.value = b.textContent; refresh(); }); });
            note.addEventListener("input", refresh);
            note.addEventListener("keydown", function(e){
                /* Tab in an empty note takes the placeholder's suggestion; after that, Tab moves on (as in TimeScheduleMod). */
                if(e.key === "Tab" && !e.shiftKey && !note.value.trim()){ e.preventDefault(); note.value = note.placeholder.replace(/^e\.g\.\s*/i, ""); refresh(); }
                else if(e.key === "Enter") dlg.querySelector(".dlg-save").click();
            });
            reload.addEventListener("change", refresh);
            /* Chrome's Save As dialog comes first, while the click still counts as the person's; reloading happens after. */
            dlg.querySelector(".dlg-save").addEventListener("click", async function(){
                var text = note.value.trim(), handle = null;
                if(window.showSaveFilePicker){
                    try {
                        handle = await window.showSaveFilePicker({ id: "ftecalc-results", startIn: "documents", suggestedName: fileName(text, reload.checked ? null : asOf),
                            types: [{ description: "Web page", accept: { "text/html": [".html"] } }] });
                    } catch(e){
                        if(e.name === "AbortError") return;
                        handle = null;
                    }
                }
                saving = true;
                dlg.querySelectorAll("button, input").forEach(function(x){ x.disabled = true; });
                try {
                    if(reload.checked){
                        setStatus("Reloading from the Time Schedule…");
                        prefixes.forEach(function(p){ delete cache[view.ay + "|" + p]; });
                        await Promise.all(prefixes.map(function(p){ return loadPrefix(p, view.ay); }));
                        status("");
                        render();
                        var failed = prefixes.some(function(p){ var c = cache[view.ay + "|" + p]; return QTRS.some(function(q){ return c[q] && c[q].status === "error"; }); });
                        if(failed) throw new Error("Couldn’t reload from the Time Schedule. Still signed in to UW?");
                    }
                    setStatus("Saving…");
                    var html = savedHtml(text), name = fileName(text, dataAsOf());
                    if(handle){
                        var out = await handle.createWritable();
                        await out.write(new Blob([html], { type: "text/html" }));
                        await out.close();
                    } else download(name, html);
                    saving = false;
                    close();
                    toast(handle ? "Saved as “" + handle.name + "”" : "Saved to your Downloads folder: " + name);
                } catch(e){
                    saving = false;
                    if(handle && handle.remove) try { await handle.remove(); } catch(err){}
                    setStatus(e.message + " Nothing was saved.", true);
                    dlg.querySelectorAll("button, input").forEach(function(x){ x.disabled = false; });
                }
            });
            refresh();
            note.focus();
        }
        document.getElementById("save-btn").addEventListener("click", openSave);
        renderChips();
        loadAll();
    }
})();
