Nihad
nihad0945
Online

Welcome Nihad. Say hi! — 13/01/2025 11:09
Waltteri — 20/01/2025 11:44
liftlog oli otettu jo ni laitetaaks vaa PowerLog esim nimeks
Jay <3 — 20/01/2025 11:45
Natsa
Waltteri — 20/01/2025 11:45
bueno
Waltteri — 20/01/2025 16:01
Nii toi sql tehtävä oli siis vaa et yappaa jotai et mitä siihe lisää vai mite se ny menikää
Jay <3 — 20/01/2025 16:02
joo
Waltteri — 20/01/2025 16:02
Nättii
Jay <3 — 20/01/2025 16:03
Image
Waltteri — 20/01/2025 16:03
bueno
oliks se esimerkki database se mediasharingapp
Jay <3 — 20/01/2025 16:07
Image
https://github.com/ilkkamtk/hybridisovellukset/blob/main/Week1/02-databases.md
GitHub
hybridisovellukset/Week1/02-databases.md at main · ilkkamtk/hybridi...
Contribute to ilkkamtk/hybridisovellukset development by creating an account on GitHub.
hybridisovellukset/Week1/02-databases.md at main · ilkkamtk/hybridi...
Waltteri — 20/01/2025 16:07
yessir
Waltteri — 20/01/2025 16:24
ton saa gpt hakattuu kahes sekunnis
sql esimerkkeinee päivinee
mut vähä stuntti
Nihad — 21/01/2025 13:25
sidosryhmä 

onko meillä sidosryhmiä?

ongelmakenttä?
Expand
sidosryhmä.txt
2 KB
Waltteri — 21/01/2025 18:10
Sovellus yhdistää monen eri sovelluksen jo olemassa olevia ominaisuuksia edulliseen sekä yhtenäiseen pakettiin. Tällä hetkellä moni sovellus on joko maksullisia tai eivät kaikki tarjoa esimerkiksi ruokavalioita tai treeni ohjelmia yhdessä paketissa. 

Monelle on hankala lähteä myös toteuttamaan suuria elämäntapojen muutoksia sillä he eivät ole tottuneet sijoittamaan näitä päivittäiseen rutiiniin. Sovelluksellamme tähtäämme myös  taklaamaan vaihtelevaa treeniaikataulua käyttämällä ”streak” järjestelmää jossa käyttäjä asettaa viikoittaisen treenimäärä tavoitteen, jonka täyttyessä käyttäjä saa mitalin viikolta.
ide — 21/01/2025 19:20
Brainstormaus:

Järjestäkää ideointisessio projektitiimin kanssa.
Käykää läpi sovelluksen tavoitteet, mahdolliset ominaisuudet ja haasteet.
Tulokset: Lista mahdollisista ominaisuuksista ja vaatimuksista.
ide — 09/02/2025 21:35
Turvallinen autentikointi:
Käyttäjien kirjautuminen tapahtuu salasanojen hajautuksella (bcrypt, Argon2).
Salasanan tulee olla vähintään 8 merkkiä pitkä ja sisältää erikoismerkkejä.
Käyttäjän salasana ei tallennu selkokielisenä mihinkään tietokantaan.
Käyttäjän oikeudet:
Käyttäjällä on oikeus pyytää omat tietonsa nähtäväksi.
Käyttäjä voi pyytää tietojensa poistamista palvelusta.
Nihad — 02/03/2025 20:51
Avaa sovellus --> Signup --> Sign in --> lisää muut profile tiedot.

-> kuvaa vaatimuksissa, muokkaa käyttötapauksia
-kirjautuminen/rekisteröityminen toiminnallisiin vaatimuksiin
-kuvaa ydinomaisuuksia
-kirjaa selvätkin asiat, tyhmillekin selvää
-käyttäjänä pitää pystyä muokkaamaan omaa tasoa
-video treeniohjelmista, näkee viikoittaisen treenin, seuraa, avaa, muokkaa treeniohjelmaa yms.
-avaa sivun -> näkee viikoittaisen/kuukausittaisen treenin, merkkaa video/sisältö tehdyksi?
-käyttäjä avaa treenin, katsoo videon
-prosessia perusteellisemmin läpi, muiden pitäisi pystyä koodaamaan tämä vaatimusten pohjalta
-adminin toiminnot puuttuvat, miten lisätä treenejä, pystyttävä lisäämään, ohjeet kategorisoitava, kategorisoidut treenit, järjestelmän kyettävä luomaan treenejä näiden pohjalta
-kg määrät yms. ei-toiminnallisiin vaatimuksiin
-aloita rekisteröitymisestä, lisää toiminto, millä, mitä poikkeuksia, mitä tietoja
-sitten kirjautuminen
-määritä mitä tietoja tarvitsen käyttäjältä yms.
-kriteerejä joita klikkaamalla voi vaan tapata, jotkin liikkeet sopivat pidemmälle ajalle, toiset lyhyemmälle 
-simppeli lähestymistapa, aloita helposta, projektin edetessä mahdollisuus muokata paremmaksi
Image
Jay <3 — 09/03/2025 21:32
https://docs.google.com/spreadsheets/d/1Y9XGB_RGrMsOPKjB70k9hmPGp0sgWPQKKgJSLRihWvg/edit?gid=0#gid=0
Jay <3 — 09/03/2025 22:04
https://docs.google.com/presentation/d/17K_bFZQSNDah5zhIBybulYgb8g7M_QO7TwA9raoPRNk/edit?usp=sharing****
Waltteri — 09/03/2025 22:07
mis järkäs esitetää noi
voin hoitaa meiä figman vaik
Jay <3 — 09/03/2025 22:07
tsegataa
homen
huomenm
Waltteri — 09/03/2025 22:07
joo richard
Jay <3 — 09/03/2025 22:08
ya mon
Waltteri — 09/03/2025 22:08
Jay <3 — 09/03/2025 22:08
classicko
Nihad — 02/04/2025 23:47
täällä viimeinen sql versio
🧍♂️ 1. Käyttäjät-taulu (Users)
Tämä taulu sisältää kaikkien järjestelmän käyttäjien tiedot.

SarakeSelitys
IdKäyttäjän yksilöllinen tunnus
UsernameKäyttäjänimi (ei voi toistua)
Expand
🧍‍♂️ 1. Käyttäjät-taulu (Users).txt
6 KB
yritä tarkistaa ja katotaan huomenna jos tarvitse korjata tai lisää mitääm
jos ok  sit huomenna aloitetaan Controller + Model + Route + midleware
Jay <3 — 02/04/2025 23:49
natssaa
Waltteri — 02/04/2025 23:56
Niice
Checkataa kans se rekisteröinti kuntoo ja ne urlit
Nihad — 03/04/2025 13:11
DB_HOST = localhost
DB_PORT = 3000
DB_USER =
DB_PASS = 
DB_NAME = powerlog
user_email = nihadazzam96@gmail.com
user_password = zhhy tuai bgxr uvtc
JWT_SECRET = AJ2pOwErlOgNW5
Nihad — 03/04/2025 22:02
missä ootte
Jay <3 — 08/04/2025 16:34
ruuan teossa
Jay <3 — 09/04/2025 14:41
labra 1 - https://docs.google.com/document/d/1rhKaGTxop3HigdtDSjOaJGrAjGC3Kt7mFKkFhq18EX0/edit?usp=sharing
Jay <3 — 09/04/2025 15:09
labra 2 - https://docs.google.com/document/d/1TjVWXJiUWB03AjG1LLnlnSrVmgmWsEPmmpJYa3niTxQ/edit?usp=sharing
ide — 09/04/2025 15:29
SIVUN RAKENNE
Register/Login
LOMAKE
-> Gender -> male/female 
-> Body Measurements -> age, height, weight 
-> Describe yourself? -> 4 vaihtoehtoa, 1 vastaus
-> Primary Motivation? -> 5 vaihtoehtoa, 1 vastaus
-> Current Fitness Level? -> 4 vaihtoehtoa, 1 vastaus
-> Fitness goal? -> 4 vaihtoehtoa, 1 vastaus, poista improve flexibility, rehabilitation
-> Weekly Activity? -> 7 vaihtoehtoa, 1 vastaus
-> Calorie summary 
-> Feedback -> 5 vaihtoehtoa
-> Profile Summary and Create
Nihad — 09/04/2025 22:07
-- Drop and recreate database
DROP DATABASE IF EXISTS powerlog;
CREATE DATABASE IF NOT EXISTS powerlog;
USE powerlog;

-- 1. Users Table
Expand
sql.txt
7 KB
@ide  @Jay <3  @Waltteri  nyt uusi versioi sql
yritä nyt tarkistaa jos sitä on hyvää tai ei
Waltteri — 09/04/2025 22:39
Checkkaan huomen
﻿
-- Drop and recreate database
DROP DATABASE IF EXISTS powerlog;
CREATE DATABASE IF NOT EXISTS powerlog;
USE powerlog;

-- 1. Users Table
CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    User_level ENUM('Admin', 'Customer', 'Owner') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. WorkoutForms Table
CREATE TABLE WorkoutForms (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    workout_program VARCHAR(255) NOT NULL,
    times_performed INT NOT NULL CHECK (times_performed >= 1 AND times_performed <= 100),
    weight_kg DECIMAL(5, 2) NOT NULL,
    sets ENUM('3X', '2X') NOT NULL,
    description TEXT,
    duration_minutes INT,
    difficulty ENUM('easy','medium','hard'),
    video VARCHAR(255),
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Workouts Table
CREATE TABLE Workouts (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    workout_form_id INT,
    workout_program VARCHAR(255) NOT NULL,
    times_performed INT NOT NULL CHECK (times_performed >= 1 AND times_performed <= 100),
    weight_kg DECIMAL(5, 2) NOT NULL,
    sets ENUM('3X', '2X') NOT NULL,
    description TEXT,
    duration_minutes INT,
    difficulty ENUM('easy','medium','hard'),
    video VARCHAR(255),
    photo VARCHAR(255),
    is_done ENUM('yes', 'no') DEFAULT 'no',
    completion_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(Id),
    FOREIGN KEY (workout_form_id) REFERENCES WorkoutForms(Id)
);

-- 4. Food Table
CREATE TABLE Food (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    meals_per_day INT CHECK (meals_per_day >= 1 AND meals_per_day <= 10),
    meal_time TIME,
    meal_type VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(Id)
);

-- 5. BMI Table
CREATE TABLE BMI (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    weight DECIMAL(5, 2) NOT NULL,
    height DECIMAL(5, 2) NOT NULL,
    bmi_value DECIMAL(5, 2) AS (weight / (height * height)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(Id)
);

-- 6. FormsQuestions Table
CREATE TABLE FormsQuestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    max INT DEFAULT 1,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. FormsAnswers Table
CREATE TABLE FormsAnswers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    answer_text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES FormsQuestions(id) ON DELETE CASCADE
);

-- 8. FormAnswers Table
CREATE TABLE FormAnswers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    form_question_id INT,
    Answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_question_id) REFERENCES FormsQuestions(id) ON DELETE CASCADE
);

-- 9. UserProfiles Table
CREATE TABLE User_Profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    gender VARCHAR(10),
    age INT,
    height INT,
    weight INT,
    workout_days INT,
    calorie_target INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);