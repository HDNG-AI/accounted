# Upper Hand – funktionskatalog ur verkligheten

Version 1, 2026-09-11. White label. Alla exempel är generiska och avidentifierade; belopp, bolag, personer, byråer och system är borttagna eller ersatta med roller. Katalogen beskriver vad en granskande funktion faktiskt behövde göra i ett verkligt uppdrag: bokslutsutredning, revisionsstöd, byråskifte, löpande genomlysning och rapportering till ny ägare i ett tillverkande bolag med projektredovisning (K2, SIE4-export ur ekonomisystemet).

Varje funktion har fyra fält: **Gör** (vad funktionen utför), **In** (data), **Ut** (resultat), **Verklighet** (det mönster som gjorde funktionen nödvändig).

---

## 0. Kontext och antaganden

Uppdragstypen som katalogen bygger på ser ut så här, generellt (finansiell DD från köparsidan i december, tillträde i februari, bokslutsutredning och revision under våren, byråskifte och ägarrapportering under hösten):

- Litet tillverkande bolag med långa projekt (månader till år per enhet), fastprisavtal, förskott i milstolpar, delvis export i utländsk valuta.
- Extern redovisningsbyrå bokför löpande; produktionen levererar underlag "när den hinner"; revisorn möter resultatet i efterhand. Ingen roll äger flödet i sin helhet.
- Ny ägare eller investerare kommer in och ställer krav på månadsbokslut, prognos och kassaplan.
- Byråskifte och revisorsbyte sker under pågående utredning.
- Historik med tidigare bokförare som lämnat ostrukturerat arv (otaggade poster, obokförda dispositioner, register som inte stämmer mot huvudbok).

Den granskande funktionen sitter mellan bolaget, byrån, revisorn och ägaren. Den bokför inte själv. Den tar fram underlag, hittar fel, formulerar förslag till bokföringsorder, följer upp att förslagen faktiskt bokförts, och rapporterar i rätt ton till rätt mottagare.

---

## 1. Datainläsning och grundavstämning

### 1.1 SIE4-parser med versionsjämförelse
**Gör:** Läser SIE4-filer (CP437/UTF-8), bygger huvudbok per konto, per verifikationsserie, per projektdimension. Jämför två uttag av samma räkenskapsår och listar exakt vilka verifikat som tillkommit, ändrats eller tagits bort.
**In:** Två eller flera .se-filer, samma bolag.
**Ut:** Diff-lista (nya ver, ändrade ver med före/efter, saknade ver), saldodiff per konto.
**Verklighet:** Byrån sa att bokslutsåtgärder var bokförda. Först en diff mellan SIE-uttag från maj och september visade vad som faktiskt gick in: vilka verifikat som ändrats i efterhand, vilka som var nya, och att en påstådd inkuransbokning saknades helt. Ändrade verifikat i ett stängt år är i sig en punkt som ska dokumenteras skriftligt.

### 1.2 IB/UB-kontinuitet över årsskifte
**Gör:** Kontrollerar att UB föregående år = IB innevarande år konto för konto, och att årets resultat i RR = rörelse på resultatkontot i BR.
**In:** SIE år N och N+1.
**Ut:** Lista över konton med brott, belopp.
**Verklighet:** Lämnade ett fastställt bokslut som stämde, men först efter att tre olika versioner av "årets resultat" cirkulerat (utkast-PDF, bokföring, stämmoprotokoll). Funktionen ska alltid peka på vilken siffra som är den fastställda.

### 1.3 Avstämning huvudbok mot sidoregister
**Gör:** Jämför huvudbokens saldo på anläggnings-, lager-, kundfordrings-, leverantörsskulds- och förskottskonton mot respektive register/specifikation.
**In:** SIE + register (anläggningsregister, lagerlista, reskontralista, förskottsspecifikation).
**Ut:** Differens per konto med kandidatförklaringar.
**Verklighet:** Anläggningsregistret stämde inte mot huvudboken; förskott från kunder stämde inte mot specifikationen; leverantörsskuld hade debetsaldo mot en enskild leverantör. Alla tre var revisorsfrågor som blockerade revisionen.

### 1.4 Bankavstämning mot verifikationsserier
**Gör:** Matchar bankrader mot betalningsverifikat och identifierar dubbla uttag, betalningar som bokförts som nya inköp i stället för att kvitta leverantörsskuld, och kundinbetalningar som parkerats på observationskonto.
**In:** Bankutdrag (CSV/PDF), SIE.
**Ut:** Omatchade bankrader, betalningar bokförda på fel sida.
**Verklighet:** En batch bankbetalningar hade bokförts som nya kostnader med momsavlyft, trots att fakturorna redan låg som skuld. Kostnad och moms dubblades. Senare visade det sig att två fakturor råkade ha samma belopp, så mönstret måste verifieras mot fakturanummer och inte bara belopp.

### 1.5 Observationskonto- och periodiseringsspårning
**Gör:** Följer varje post som parkerats på observations- eller interimskonton (29xx/17xx/2999) från inbokning till upplösning, över årsskiften.
**In:** SIE flera år.
**Ut:** Kedja per post: var den kom ifrån, vad som hänt, om den är stängd, om upplösningen hamnat på rätt konto.
**Verklighet:** En kundbetalning låg kvar på obs-konto över årsskiftet, periodiserades, krediterades och löstes upp via tre olika verifikat i två år. Slutsatsen efter utredning var "inget kvar att boka". Utan kedjan hade samma belopp räknats som fel två gånger.

---

## 2. Projektredovisning och intäktsredovisning

### 2.1 Projektkodsanalys (dimension per enhet)
**Gör:** Summerar per projektkod vad som ligger kvar på balans (lager/PIA) respektive kostnadsförts direkt, och vad som fakturerats. Listar poster på lager- och intäktskonton som saknar projektkod.
**In:** SIE med #DIM/#OBJEKT.
**Ut:** Tabell per projekt: nedlagt på balans, kostnadsfört, fakturerat, otaggat.
**Verklighet:** Intäkter saknade projektkod helt (vissa var taggade med fakturanummer i stället för projekt). Kostnader var till stor del taggade. Det gjorde att marginal per enhet inte kunde läsas ur systemet förrän en manuell fördelning gjorts.

### 2.2 Kostnadsavräkning vid leverans (KSV-kontroll)
**Gör:** För varje kundfaktura som avser leverans av en enhet: kontrollerar att motsvarande nedlagd kostnad flyttats från lager/PIA till kostnad sålda varor. Flaggar levererade och slutfakturerade enheter som fortfarande ligger på balans.
**In:** Kundfakturor (SIE B-serie), projektkodsanalys, leveransstatus från produktion.
**Ut:** Lista: fakturerad enhet, belopp kvar på balans, föreslagen KSV-order.
**Verklighet:** Viktigaste enskilda felet. Flera enheter var slutfakturerade utan att en krona flyttats till KSV. Resultatet saknade kostnad sålda varor helt, samtidigt som lagerkonton växte med tiotals procent. Ingen part såg det förrän balans och intäkter lästes ihop per projekt.

### 2.3 Metodkontroll intäktsredovisning (K2 huvudregel/alternativregel)
**Gör:** Identifierar vilken metod bokföringen faktiskt tillämpar (kontostruktur 1470/2420/4970 kontra 1620/2450), kontrollerar konsekvens mellan enheter, och beräknar effekten av byte.
**In:** SIE, kontrakt per enhet (pris, betalplan), beräknad totalkostnad per enhet.
**Ut:** Metodbedömning, effekt per enhet, förslag till konsekvent tillämpning.
**Verklighet:** En enhet hade fått successiv vinstavräkning (30 % upplöst ur förskott mot färdigställandegrad), övriga inte. Metoden var tillåten men inkonsekvent tillämpad. Formkostnad och utvecklingskostnad måste skiljas ut ur projektkostnaden innan färdigställandegrad kan beräknas.

### 2.4 Förskottsupplösning per kund
**Gör:** Bygger kontospecifikation för förskott från kunder över alla år: inbetalning, upplösning, kvarvarande saldo per kund och enhet.
**In:** SIE flera år, offert/orderunderlag.
**Ut:** Förskottsspecifikation per kund som summerar till kontosaldot.
**Verklighet:** Förskottskontot var otaggat och orört ett helt år trots leveranser. Saldot kunde förklaras fullständigt först genom att gå igenom huvudboken tre år bakåt. Utan specifikationen kunde varken not, prognos eller revision stängas.

### 2.5 Paketfaktura-uppdelning (milstolpsfakturor för flera enheter)
**Gör:** När en kund har beställt flera enheter i ett paket och faktureras per milstolpe för hela paketet: fördelar fakturerat belopp per enhet enligt betalplan och kontrakt, stämmer mot färdigställandegrad per enhet.
**In:** Offert/kontrakt, betalschema, kundfakturor, projektkodsanalys.
**Ut:** Intäkt per enhet, skillnad mot bokfört.
**Verklighet:** En exportkund hade ett paket om tre enheter med 30/30/30/10-betalplan. Fakturorna gick på ett intäktskonto utan projektkod. Scope hade vuxit (en enhet uppgraderad till dyrare modell) så summa enheter > offert. Utan fördelningen dubbelräknades intäkt i en enhet och saknades i en annan.

### 2.6 Fakturamönsteranalys (utställ/kreditera samma period)
**Gör:** Hittar fakturor som utställts och krediterats inom kort tid, samma belopp, dubbelfakturor och omnumrerade fakturor. Kopplar till slutlig faktura.
**In:** SIE kundfakturaserie.
**Ut:** Kluster med nettoeffekt och tolkning.
**Verklighet:** Fyra fakturor samma dag, tre krediterade två veckor senare, en kvar. Ren dokumentationsövning mot kund, inte bokföringsfel, men revisorn behövde förklaringen färdig. Separat fall: en faktura omnumrerad, periodiserad och krediterad i ett annat år, vilket såg ut som överredovisning tills kedjan spårats.

### 2.7 Valutakontrakt och FX-rest
**Gör:** För kontrakt i utländsk valuta: räknar om fakturerat/inbetalt till avtalsvaluta, isolerar kursdifferens från verklig över/underfakturering.
**In:** Kontrakt (valuta, belopp), fakturor i SEK, bankinbetalningar.
**Ut:** Rest mot kontrakt uppdelad i FX och faktisk avvikelse.
**Verklighet:** Vad som såg ut som en avvikelse på hundratusentals kronor var till större delen valutaeffekt plus en dubbelfaktura som redan hanterats.

### 2.8 Lånad/konsignerad utrustning i PIA
**Gör:** Kontrollerar att utrustning som leverantören lånar ut (betalas först vid försäljning) inte ligger som tillgång i pågående arbete.
**In:** PIA per projekt, leverantörsavtal/konsignationsvillkor.
**Ut:** Poster som ska ligga off-balance.
**Verklighet:** Demoenhet med partnerutrustning. Endast bolagets egen produktionskostnad ska ligga i PIA.

### 2.9 Demoenhet: lager eller anläggning
**Gör:** Identifierar enheter som byggs för eget bruk (demo, utställning) och som inte ska säljas; föreslår omklassning från lager till anläggningstillgång med avskrivning från datum i bruk.
**In:** Ledningsbeslut om enhetens användning, projektkodsanalys.
**Ut:** Omklassningsorder, avskrivningsbas, förslag till nyttjandeperiod.
**Verklighet:** Två demoenheter med betydande nedlagd kostnad låg som lager. Beslut om att behålla dem ändrade klassificering, inkuransfråga och prognos (budgetobjekt "försäljning av demo" utgick).

---

## 3. Anläggningstillgångar

### 3.1 Anläggningsregister-rekonstruktion
**Gör:** Bygger komplett register på radnivå ur huvudbok, fakturor och tidigare register, grupperar till objekt, avstämmer mot anskaffningskonto, ackumulerade avskrivningar och årets avskrivning i tre separata bryggor.
**In:** SIE flera år, leverantörsfakturor, befintligt register, bokslutsnot.
**Ut:** Register med objekt, anskaffningsvärde, i-bruk-datum, metod, ack. avskr., årets avskr.; tre avstämningar som går till noll.
**Verklighet:** Registret saknades i ekonomisystemet, byrån sköt implementeringen till nästa år, avskrivningar bokfördes manuellt via bokföringsorder på ett kalkylark som bolaget tagit fram. Kostnader från tidigare år som borde aktiverats låg på kostnadskonton och PIA.

### 3.2 Avskrivningskontroll per kategori
**Gör:** Räknar om årets avskrivning per objekt utifrån metod, nyttjandeperiod och delårsfaktor; jämför med bokfört. Kontrollerar att bokslutsnotens nyttjandeperiod täcker alla kategorier.
**In:** Register, SIE.
**Ut:** Teoretisk vs bokförd avskrivning, differens med förklaring, notavvikelse.
**Verklighet:** Två nyttjandeperioder tillämpades (verktyg 5 år, formar 20 år) men noten angav bara en. En differens som först såg ut som fel var delårsavskrivning på nyaktiverade objekt. Ett "falskt larm" i utredningen kostade en vända med revisorn; funktionen ska räkna delår innan den larmar.

### 3.3 Avskrivningsuppföljning löpande år
**Gör:** Kontrollerar att avskrivningar bokförs månadsvis under året, inte bara vid bokslut, och att inga tomma eller framtidsdaterade verifikat ligger i serien.
**In:** SIE löpande år.
**Ut:** Saknade månader, tomma verifikat, framtidsdaterade verifikat.
**Verklighet:** Inga avskrivningar alls på huvudkategorin under åtta månader, en tom verifikation daterad årets sista dag. Resultatet var därmed överskattat med nästan en halv miljon.

### 3.4 Rättelse av tidigare års fel enligt K2
**Gör:** Formulerar rättelse av fel från tidigare år i innevarande år (K2), dokumenterar ansvar (byrån friskriver sig, revisorn bedömer) och ser till att posten inte dubbelbokas mot befintliga manuella verifikat när register läggs upp i systemmodul.
**In:** Bokföringsorder, revisorsbedömning.
**Ut:** Dokumenterad rättelsekedja, kontroll IB modul = IB huvudbok.
**Verklighet:** Byrån avrådde från aktivering av tidigare års kostnader; revisorn bedömde den korrekt enligt K2 och signerade. Vid systemmodulens införande måste IB stämma exakt, annars dubbla avskrivningar.

---

## 4. Eget kapital, närstående och bolagsrätt

### 4.1 Resultatdispositionskontroll
**Gör:** Kontrollerar att föregående års resultat omförts från årets resultat till balanserat resultat per stämmodatum, varje år bakåt tills kedjan stämmer mot fastställda årsredovisningar.
**In:** SIE flera år, stämmoprotokoll.
**Ut:** År där disposition saknas, föreslagen omföring, datum.
**Verklighet:** Två års dispositioner saknades. Konto "årets resultat" bar två års resultat. Balanserat resultat visade fel belopp mot årsredovisningen. Netto stämde, brutto inte. Bakomliggande orsak andra gången: stämmoprotokollet var inte signerat och skickat till byrån, alltså bolagets miss, inte byråns. Funktionen ska först kontrollera att verifikationsunderlaget finns innan den lägger fel på byrån.

### 4.2 Aktiekapital mot aktiebok
**Gör:** Stämmer aktiekapital i huvudbok mot aktiebok (antal aktier × kvotvärde), spårar nyemissioner från teckning till registrering, kontrollerar datumordning (inbetalning före/efter registrering) och att ej registrerat kapital omförts.
**In:** Aktiebok, registreringsbevis, teckningslistor, SIE.
**Ut:** Avstämning, saknade underlag, datumavvikelser.
**Verklighet:** Emissioner från två år tidigare registrerades först nu; ett stort kapitaltillskott bokfördes med registreringsverifikat daterat före inbetalningen. Ägarförändring efter balansdagen krävde upplysning i förvaltningsberättelsen.

### 4.3 Närståendespecifikation
**Gör:** Bygger specifikation över lån från ägare och närstående bolag: IB, nya lån, återbetalningar, konverteringar till eget kapital, ränta, avtal. Identifierar personer som är närstående i flera roller (ägare + hyresvärd + leverantör).
**In:** SIE, lånemaster, bank, aktiebok, avtal.
**Ut:** Specifikation per motpart, saknade låneavtal, saknad ränta, upplysningsbehov.
**Verklighet:** Ägarlån i tvåsiffriga miljonbelopp utan bokförd ränta och utan avtal i mappen. En part var samtidigt ägare via bolag, hyresvärd och leverantör. Lån reglerades efter balansdagen, vilket krävde upplysning.

### 4.4 Förbjudet lån / fordran på anställd
**Gör:** Granskar konto för fordringar hos anställda: klassificerar poster (företagskortköp utan kvitto, utlägg, verkligt lån), följer utvecklingen över året.
**In:** SIE, kortutdrag.
**Ut:** Lista per rad med föreslagen åtgärd (kvitto + kontering, löneavdrag, återbetalning).
**Verklighet:** Revisorn anmärkte på ett litet belopp. Under året växte det, eftersom rotorsaken var kvittorutinen: kortköp utan underlag hamnade som fordran på anställd. Funktionen ska peka på rotorsaken och föreslå rutin, inte bara bokföringen.

### 4.5 Förlikning och tvistereglering
**Gör:** Läser förlikningsavtal och översätter varje klausul till bokföringskonsekvens: nedskrivning av skuld, bortskrivning av fordran, aktieöverlåtelse, återbetalning av lån.
**In:** Avtal, SIE.
**Ut:** Klausul → verifikat-mappning, poster som saknas.
**Verklighet:** Ett förlikningsavtal förklarade en "fordran" som revisorn frågat om, en nedskriven leverantörsskuld, ett återbetalt ägarlån och en aktieöverlåtelse i aktieboken. Utan avtalet såg fyra separata poster ut som fyra separata fel.

### 4.6 Skatt och periodiseringsfond
**Gör:** Räknar om bolagsskatt från skattemässigt resultat, kontrollerar att periodiseringsfond ligger på årsspecifikt konto med rätt namn, att skatteskuld rör sig mot skattekontot, och att ej avdragsgilla avgifter konteras rätt.
**In:** SIE, skattekontoutdrag, avgiftsbeslut.
**Ut:** Avvikelser, kontoförslag.
**Verklighet:** Rätt belopp på fel årskonto (kontonamn från tio år tidigare), skatteskuld orörd, momsfordran utan avstämning mot skattekonto, förseningsavgift som måste på ej avdragsgillt konto.

---

## 5. Revisionsstöd

### 5.1 Revisorsfrågelista → status per punkt
**Gör:** Tar revisorns lista över utestående punkter och stickprov, ger varje punkt status (erhållet/ej erhållet), ansvarig (bolag/byrå/granskare), leveransplan med datum, och färgkodar per ansvarig.
**In:** Revisorns sammanställning, stickprovslista.
**Ut:** Statusflik som uppdateras mellan möten.
**Verklighet:** 23 punkter plus 69–74 stickprov. Revisorn ville avsluta. Regeln som växte fram: aldrig svara "ska tas fram", alltid vem och när.

### 5.2 Stickprovsavstämning
**Gör:** För varje stickprovsrad: matchar verifikat mot faktura och bankutdrag, noterar betalningsverifikat, fakturanummer och avvikelser.
**In:** Stickprovslista, SIE, fakturor, bank.
**Ut:** Ifylld tabell: avstämt mot faktura, avstämt mot bank, kommentar.
**Verklighet:** Rutinjobb men volymen gör det till en funktion. Flera stickprov pekade på samma underliggande fel (t.ex. resultatdispositionen), så funktionen ska gruppera stickprov per rotorsak.

### 5.3 Riskfördelning av stickprov
**Gör:** Klassar stickproven i riskgrupper (rotorsak, belopp, sannolikhet för justering) inför revisorsmötet.
**In:** Stickprov + status.
**Ut:** Sammanställning per riskgrupp.
**Verklighet:** Gav mötet struktur: vilka punkter kräver bokföring, vilka kräver underlag, vilka är presentationsfrågor (brutto/netto i not).

### 5.4 Notunderlag (brutto/netto-frågor)
**Gör:** Bygger notunderlag för pågående arbeten, förskott, anläggningar, eget kapital enligt K2:s uppställning, och flaggar när tidigare års not tillämpat annan (K3-liknande) presentation.
**In:** SIE, register, specifikationer.
**Ut:** Notutkast med källhänvisning per rad.
**Verklighet:** Tidigare års not var en summering av två konton i stil med K3, vilket skapade avstämningsproblem i eget kapital året efter.

### 5.5 Verifikationslogg för ändrade verifikat
**Gör:** Skriver den skriftliga förklaringen till ändrade verifikat i stängt år (vad, varför, underlag, vem beslutade).
**In:** SIE-diff, underlag.
**Ut:** Not till revisor/ny byrå.
**Verklighet:** Byrån skrev inte noten. Granskaren fick göra det själv. Ska vara standardleverans vid varje SIE-diff som visar ändrade verifikat i stängt år.

---

## 6. Byrå- och systemskifte

### 6.1 Genomlysning av löpande bokföring inför skifte
**Gör:** Kör hela kontrollpaketet (avsnitt 1–4) mot senaste SIE och balansrapport, delar upp i "poster att rätta" och "underlag att begära ut medan samarbetet är intakt".
**In:** SIE löpande år, balansrapport.
**Ut:** Två listor med datumkrav per punkt.
**Verklighet:** Samarbetsviljan sjunker efter uppsägningsbesked. Allt som kräver byråns aktiva medverkan ska begäras före beskedet, i ett samtal som ramas som halvårsavstämning.

### 6.2 Överlämnings-PM
**Gör:** Skriver PM till ny byrå: kontostruktur, öppna poster, kända felkällor, rutiner, systemåtkomst, bokslutsfil, vad avgående byrå gör före stängning och vad som parkeras till ny byrå.
**In:** Alla ovanstående listor, beslutade datum.
**Ut:** PM + gemensam arbetslista bolag/avgående byrå/ny byrå.
**Verklighet:** Parallell månad med två byråer. Punkter som avgående byrå inte hann med skrevs in i PM:et så att de inte föll mellan stolarna.

### 6.3 Avstämningsmejl med svar per punkt
**Gör:** Formulerar avstämningsmejl till byrån med en punkt per rad, belopp och konto, och läser byråns svar mot listan: vilka punkter besvarades konkret, vilka generellt, vilka missades, vilka påstås bokförda utan att synas i SIE.
**In:** Punktlista, byråns svar, ny SIE.
**Ut:** Status per punkt: klart / bolaget levererar / byrån gör / parkeras.
**Verklighet:** Byrån svarade generellt på specifika frågor, tolkade en verifikationsfråga som en innehållsfråga, och påstod en bokning som inte fanns. Funktionen ska verifiera varje "bokfört" mot SIE.

### 6.4 Rutinkrav vid onboarding
**Gör:** Listar rutinkraven som ska in i beställningen till ny byrå: månadsbokslut senast dag X, projektkod obligatorisk på intäkts- och kostnadskonton, attest vid beställning, skriftlig färdigsignal från produktion, digital kvittohantering.
**In:** PM interna rutiner, ägarkrav.
**Ut:** Kravlista i beställningen.
**Verklighet:** Onboardingen är enda tillfället att gratis slå fast vad byrån tar och vad som blir internt.

### 6.5 Systemgränssnitt ekonomi/produktion
**Gör:** Kartlägger vilket system som äger lager, order, projektkoppling av fakturor och färdigsignal, och var gatekeepern för projektkod sitter.
**In:** Intervjuer, systemlista.
**Ut:** Gränssnittskarta, nyckelpersonberoenden.
**Verklighet:** Egenutvecklat produktionssystem hos en nyckelperson, ekonomisystem hos byrån, projektinformation i huvudet på produktionsledaren. Lösningsförslag: order per enhet i ekonomisystemet kopplad till projektkod, delfakturering från ordern, avtalsarkiv i delad mapp.

---

## 7. Rapportering till ledning och ägare

### 7.1 Budget mot utfall med principkontroll
**Gör:** Jämför budget mot bokfört per konto och månad, men kontrollerar först att budgeten följer samma redovisningsprincip som bokföringen (delbetalning ≠ intäkt).
**In:** Budgetfil, SIE.
**Ut:** Rapport med nyckeltal, per månad, RR per konto, balans IB–UB, budgetobjekt som syns i bokföringen.
**Verklighet:** Budgeten räknade delbetalningar som intäkt och låg tiotals miljoner över bokfört. Bara ett av tretton budgetobjekt syntes i bokföringen. Rapporten ska säga det utan att läsas som kritik av budgetens upphovsman.

### 7.2 Prognos på leveransbasis
**Gör:** Bygger prognos per enhet i klasser (fakturerad / bekräftad order / säker >75 % / osäker <75 % / utgår), med pris, byggkostnad, nedlagt, fakturerat, återstående kostnad, leveransmånad. Kostnadsmassa ur run-rate i SIE, uppdelad personal/övrigt.
**In:** SIE, orderbok, samtal med produktion en enhet i taget.
**Ut:** Sammanställning i ägarens format, arbetsfil med gula fält.
**Verklighet:** Ägarens krav: intäkter helår "endast nära nog säkra", bruttovinst, kostnadsmassa, run-rate, väsentliga kostnadsökningar. Regel: budgetobjekt utan spår i bokföringen räknas inte.

### 7.3 Kassaplan och räckvidd
**Gör:** Räknar burn per månad ur SIE, kassa, kända inbetalningar, förfallna kundfordringar, momsfordran; ger räckvidd i månader.
**In:** SIE, bank, reskontra.
**Ut:** Räckvidd med och utan osäkra inbetalningar.
**Verklighet:** Stor kundfordran obetald sedan flera månader, momsfordran ej avstämd, förskott orört. Räckvidd ~4 månader utan kundinbetalningar, vilket styrde prioriteringen av allt annat.

### 7.4 Kostnadsgenomgång som beslutsunderlag
**Gör:** Listar poster över tröskel per leverantör och konto, exkl. moms, med kolumner för beslut och ägare. Ingen rad är en rekommendation.
**In:** SIE.
**Ut:** Lista till VD.
**Verklighet:** Löpande inköpsflöden utan tydlig ägare av behovsprövning. Funktionen ska vara underlag för samtal, inte dom.

### 7.5 Månadsbokslut i ägarens portal
**Gör:** Definierar leveranskedjan: byrån stänger månaden senast dag X, granskaren verifierar KSV/avskrivningar/förskott, rapport till VD med anpassade nyckeltal, uppladdning i ägarens format.
**In:** Månads-SIE.
**Ut:** Checklista per månad.
**Verklighet:** Kravet kom från ny ägare samtidigt som byråskiftet, så leveranskedjan behövde skrivas in i beställningen till nya byrån.

### 7.6 Leverantörsforecast
**Gör:** Bygger forecast per modell och kvartal till strategisk leverantör, med låg/hög-scenario och indikativt förbehåll, ur orderbok och pipeline.
**In:** Orderbok, BOM-listor med kontraktspriser, ledningens bedömning.
**Ut:** Forecastfil i leverantörens format.
**Verklighet:** Leverantörens sponsor lämnade sin roll, forecasten var villkor för förmånligt avtal. Deadline styrde allt; kända order skildes från antaganden.

---

## 8. Intern kontroll och styrning

### 8.1 Åtgärdslista med ägare och datum
**Gör:** Underhåller tracker med ID, huvud-/delmoment, kategori, ansvarig, prioritet, status (Ej påbörjad / Pågående / Väntar beslut av [namn] / Blockerad av [x] / Klar → Arkiv), start, beräknat klart, försenad-flagga, ändringslogg. Räknar öppna punkter utan ägare.
**In:** Möten, mejl, dokument.
**Ut:** Uppdaterad fil, månadsutdrag till styrelse.
**Verklighet:** 106 öppna punkter utan ansvarig och datum vid övertagandet. Två punkter med samma ID. Regler som växte fram: en ägare per punkt, nya punkter bara med ägare + deadline, max fem "Kritisk", VD delegerar i rummet, filen uppdateras samma dag.

### 8.2 PM om intern kontroll till styrelse
**Gör:** Svarar på revisorns anmärkning om intern kontroll med kort PM: bärande tes, nyckeltal (öppna punkter, extra revisionsarvode, förseningsavgifter), tre alternativ, fyra rutiner som gäller oavsett vägval, timingargument.
**In:** Tracker, revisionsberättelse, kostnader.
**Ut:** 3-sidigt PM.
**Verklighet:** Tesen var att ingen roll äger flödet. Rekommendation: ekonomistyrning med mandat 1–2 dagar/vecka (inte rekrytering), byrån kan komplettera men inte ersätta (kan inte kravställa mot sig själv).

### 8.3 Inköpsrutin och attest
**Gör:** Föreslår attestordning med attest vid beställning, fördelning av inköpsansvar per kategori inom befintlig organisation, ramavtal, enkel avvikelselogg mot leverantör (reklamation, kreditering, ritningsversion före bearbetning).
**In:** Iakttagelser, kostnadsgenomgång.
**Ut:** Rutinförslag som trackerpunkter.
**Verklighet:** Omarbete efter leverantörsfel utan reklamation, bearbetning mot fel ritningsversion, fakturor attesterade utan att någon ägde innehållet.

### 8.4 Trackerförslag i väntan på godkännande
**Gör:** Producerar förslag till nya punkter och ändringar som separat granskningsdokument; för inte in något i trackern förrän VD godkänt.
**In:** Möte med VD.
**Ut:** Förslagsdokument med revisionsnummer.
**Verklighet:** Dokumenten läses av fler än VD (ägare, grundare). Förslag och beslut måste hållas isär.

---

## 9. Finansiell due diligence (målbolagets sida)

Köparens rådgivare skickar en informationsförfrågan (IRL) med numrerade punkter. Målbolaget svarar. Den granskande funktionen sitter på målbolagets sida och ska göra svaren färdiga, konsekventa med bokföringen och försvarbara. Samma SIE som DD-rådgivaren läser är den som bokslutsutredningen rättar, så DD och bokslut hänger ihop.

### 9.1 IRL-tracker
**Gör:** Underhåller köparsidans frågelista som tabell: nummer, datum, område, begäran, prioritet, status (Open / Pending / Closed), kommentar från målbolag, kommentar från rådgivare, datum för inlämning. Flaggar punkter där svaret är "finns i SIE" utan att en färdig analys levererats.
**In:** Rådgivarens IRL (xlsx), levererade filer.
**Ut:** Uppdaterad tracker, lista över punkter som fortfarande kräver eget arbete.
**Verklighet:** Flera punkter besvarades med "Available in SIE". Det är inte ett svar; köparen vill ha nedbrytningen gjord. Punkter med utlovat datum ("Work in progress, estimated completion …") måste följas upp.

### 9.2 Månadsvis RR/BR per konto och enhet
**Gör:** Levererar SIE4 eller Excel med resultat- och balansräkning på kontonivå per månad, för de två senaste hela räkenskapsåren plus innevarande år t.o.m. senaste stängda månad, per legal enhet och konsoliderat.
**In:** SIE per år.
**Ut:** Paket i begärd form, kontrollerat mot IB/UB-kontinuitet (1.2).
**Verklighet:** Första punkten på listan, "High", stängdes snabbt. Allt annat bygger på den, så eventuella fel i SIE (avsnitt 1–4) syns direkt hos köparen.

### 9.3 Normaliseringslista (engångsposter, QoE)
**Gör:** Identifierar och dokumenterar poster som inte speglar underliggande prestation: försäkringsersättningar, transaktionskostnader, uppsägningar, tvister, omstrukturering, hyresrabatter, inkuransnedskrivningar, uppstartskostnader, flyttkostnader, garantiärenden som kan återvinnas, rådgivarkostnader som är DD-specifika. Per post: leverantör, datum, tjänst, belopp inkl. och exkl. moms, påverkat konto, underlag, klassning (One-off / DD-specifik / möjlig återvinning).
**In:** SIE, leverantörsfakturor.
**Ut:** Tabell grupperad per leverantör med summa inkl./exkl. moms.
**Verklighet:** Listan innehöll flytt av produktion (transport och kran i flera omgångar), omlackering efter leverantörsfel, uppstartskostnad i ny produktionsanläggning, en serie fakturor från tidigare bokföringsleverantör för uppstädning, garantireparation av motor (kan ersättas), juridiskt ombud i tvist, och granskarens eget DD-arbete. Poängen: allt som kan försvaras som engångsposter lyfter justerad EBITDA, men varje rad måste ha faktura bakom sig.

### 9.4 Nedbrytning per produktgrupp och kund
**Gör:** Intäkt, bruttomarginal och EBITDA per produktgrupp och per kund, månadsvis, med pris- och volymdata där det finns, samt handelsvillkor per kund.
**In:** SIE med projektdimension, kundfakturor, kontrakt.
**Ut:** Tabell per produktgrupp/kund/månad.
**Verklighet:** Kunde inte levereras ur systemet eftersom intäkter saknade projektkod och KSV saknades (2.1–2.2). Svaret blev "finns i SIE" plus ett kvalitativt påstående om framtida marginalförbättring, vilket köparens rådgivare inte kan använda. Funktionen ska bygga nedbrytningen uppifrån (kontrakt + nedlagd kostnad per enhet) när systemet inte räcker.

### 9.5 Anläggningsregister per enhet och datum
**Gör:** Levererar anläggningsregister per legal enhet per senaste tillgängliga datum (3.1).
**Verklighet:** Utlovades "i samband med novembersiffrorna". Registret fanns inte, se avsnitt 3.

### 9.6 Lageruppdelning
**Gör:** Delar upp lager per kategori (råvaror, PIA, färdiga varor, förskott till leverantör) per bokslutsdag två år bakåt och per YTD, med koppling till projekt.
**In:** SIE, lagerlistor.
**Ut:** Tabell per kategori och datum.
**Verklighet:** "Finns i SIE". Verkligheten: lagret var det största och sämst specificerade i balansräkningen, med en betydande del på levererade enheter och på enheter utan känd kund.

### 9.7 Åldersanalys kundfordringar och leverantörsskulder
**Gör:** Ålderslägger fordringar och skulder per bokslutsdag och YTD (ej förfallet, <30, <60, >60 dagar), med kommentar per större post.
**In:** Reskontra, SIE.
**Ut:** Åldersanalys med kommentarer.
**Verklighet:** Begärdes för två datum. En stor exportfordran var öppen i månader, en leverantör hade debetsaldo. Båda kräver förklaring, inte bara tabell.

### 9.8 Checklista poster utanför balansräkningen
**Gör:** Går igenom och dokumenterar bokföringsmässig behandling av: förväntad utdelning, leasingåtaganden, personalbonus, provisioner/kick-backs eller skatter som inte bokförs löpande, spärrade medel och depositioner, transaktionsbonusar, transaktionsrådgivare (M&A, juridik, revision, DD), tvister med kunder/leverantörer/f.d. anställda, timbank/övertidsskuld, checkkredit, upplupen ränta, övriga oredovisade förpliktelser.
**In:** Avtal, SIE, ledningsintervju.
**Ut:** Punkt-för-punkt-svar med hänvisning.
**Verklighet:** Svaret pekade på en låneflik och ett leasingavtal för en bil. Övriga elva delpunkter var obesvarade. Tvisten (som fanns) stod inte i svaret men syntes i normaliseringslistan som juridikkostnad. Funktionen ska korsläsa svaren mot varandra.

### 9.9 Ägarlånsavstämning mot bank och årsredovisning
**Gör:** Listar varje in- och utlåning från ägare: datum, belopp, långivare, verifikat, bankutdragsreferens, om posten stämmer med årsredovisningen, konverteringar till villkorat tillskott/aktiekapital, förlikningsposter, omklassificeringar mellan långivare, räntevillkor.
**In:** SIE flera år, bankutdrag, ÅR.
**Ut:** Avstämd lånemaster med kolumnen "stämmer med ÅR?" och summa per långivare.
**Verklighet:** Femtio-tal rader över fem år. Två insättningar utan hittat bankutdrag, två inlåningar på samma verifikat, kolumn "Okänd" långivare, år där lånen inte stämde med ÅR (samma rotorsak som 4.1). Ingen ränta på ägarlån var ett uttryckligt villkor som ska dokumenteras. Detta blad blev sedan grunden för närståendespecifikationen (4.3).

### 9.10 Momskorrigering tidigare år
**Gör:** Dokumenterar momsrättelser för tidigare år som separat blad i DD-paketet.
**Verklighet:** Bladet fanns men var tomt. Köparen ser ett tomt blad som en öppen fråga.

### 9.11 Budget och prognos med backup
**Gör:** Levererar månadsbudget/prognos för innevarande och nästa år med Excel-backup för intäkts- och kostnadsantaganden på lägsta nivå, för RR, BR och kassaflöde, granskad av ledningen. Kontrollerar att budgetprincipen = redovisningsprincipen (7.1).
**Verklighet:** Levererades med utlovat datum. Budgeten som senare låg till grund för uppföljning räknade delbetalningar som intäkt, se 7.1. Det köparen fick i DD och det som sedan gick att uppnå skilde sig kraftigt, vilket blev nästa ägares första fråga.

### 9.12 Konsistenskontroll DD-paket mot bokslutsutredning
**Gör:** Kontrollerar att siffror i DD-svaren (normaliseringar, lån, lager, fordringar) är samma som i bokslutsutredningen och den fastställda årsredovisningen, och att fel som hittats efter DD-leveransen kommuniceras.
**In:** DD-paket, masterarbetsbok, ÅR.
**Ut:** Avvikelselista.
**Verklighet:** DD gjordes i december på november-siffror. Bokslutsutredningen hittade sedan dubbelbokningar, saknad KSV, obokförd disposition och register som inte stämde. Den nya ägaren ställde krav på månadsbokslut och prognos direkt efter tillträdet. En funktion som kopplar DD-svaren till efterföljande rättelser är det som gör granskaren trovärdig hos båda parter.

---

## 10. Kommunikation och ton (tvärgående regler)

Dessa är inte funktioner i sig men styr hur varje output formuleras. De kom ur verkliga misstag och rättelser.

### 10.1 Neutral ton i dokument som läses av flera
Inget får läsas som att någon gjort fel bakåt eller att inköp varit oansvariga. Skriv "avräknas mot leverans / ännu inte kostnadsförts", inte "aldrig kostnadsförts". Skriv "kund framgår inte av bokföringen", inte "ingen kund". Skriv "presenteras transparent men kräver ingen ytterligare åtgärd", inte "fel som byrån missade".

### 10.2 Förutsätt inte rekrytering
Led med behovsanalys, agera efter behovet med eller utan konsulter, rollsätt internt över tid. Säkra funktioner (inköp, ekonomistyrning) inom befintlig organisation.

### 10.3 Mottagaranpassning
Byrån: transparent, metodisk, en punkt per rad med belopp och konto. Produktionsledaren: SMS-längd, bara det som kräver hans svar, en enhet i taget. Revisorn: vem och när per punkt, aldrig "ska tas fram". Styrelse/ägare: kort PM, nyckeltal, alternativ, rekommendation.

### 10.4 Skilj fel från villospår
Innan en post rapporteras som fel: verifiera mot fakturanummer (inte bara belopp), räkna delårseffekter, spåra periodiseringskedjor över årsskiften, kontrollera att verifikationsunderlag (t.ex. stämmoprotokoll) faktiskt levererats till byrån. Flera larm i uppdraget var falska och kostade förtroende.

### 10.5 Rätta egna fel öppet
När granskaren själv hade fel (påstått "kontrollerat att beloppet inte dubbelräknas", vilket var fel), rättas det uttryckligen i nästa leverans. Funktionen ska hålla en rättelselogg.

### 10.6 Använd den fastställda siffran
När flera versioner av samma dokument finns (utkast-PDF, bokföring, stämmoprotokoll, signerad ÅR): markera vilken som är fastställd och varna för de andra.

### 10.7 Källhänvisning per påstående
Varje siffra i en leverans pekar på verifikat, fil, flik eller mejl. Inga spekulativa slutsatser.

---

## 11. Datakällor funktionen behöver kunna läsa

SIE4 (flera uttag per år), balans- och resultatrapport (PDF), kontoanalys (PDF), bankutdrag (CSV/PDF), kund- och leverantörsreskontra, momsrapport, skattekontoutdrag, bokföringsorder (PDF/docx), leverantörs- och kundfakturor (PDF), offerter och kontrakt (docx/PDF), betalplaner (xlsx), aktiebok, stämmoprotokoll, årsredovisning (utkast och fastställd), revisorns frågelista och stickprovslista, anläggningsregister, lagerlistor per projekt, budgetfil, orderbok, låneavtal och förlikningsavtal, mejltrådar med byrå och revisor.

---

## 12. Leveransformat som visat sig fungera

- **Masterarbetsbok (xlsx)** med flikar: revisorns frågor med status, till byrån, anläggningsregister med tre avstämningar, närståendespecifikation, riskfördelning, kommentar till revisor, per enhet, projektredovisning per enhet, successiv vinstavräkning, avstämning taggat/ototaggat, stickprov. Gula celler = bolaget fyller i, grå = formler, blå = antagande.
- **Arbetsfil prognos (xlsx)**: Instruktion, Sammanställning (formler), Intäkter (klass per rad), Projekt per enhet, Kostnader (run-rate), Kostnadsgenomgång, Frågor till produktion.
- **Åtgärdslista (xlsx)**: Åtgärdslista, Arkiv, Läsanvisning. Kolumner A–O med sortnyckel och försenad-formel.
- **Samtalsguide (docx)** inför känsligt möte: ram, punkter med datumkrav, checklista sist.
- **PM (PDF, 3 sidor)** till styrelse.
- **Rapport (PDF, ~8 sidor)** till VD: nyckeltal, per månad, avvikelser, kända brister, rekommendationer.
- **Förslagsdokument (docx, revisionsnumrerat)** för tracker-ändringar som väntar beslut.

---

*Slut på version 1. Nästa steg: prioritera vilka funktioner som byggs först (förslag: 1.1, 1.2, 2.1, 2.2, 3.3, 4.1, 5.1, 8.1, 9.1, 9.3), eftersom de fångade de dyraste felen och är helt datadrivna ur SIE.*
