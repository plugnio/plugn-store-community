<template>
    <ion-header class="clear-header">
        <ion-toolbar>
            <ion-buttons slot="start" v-if="!isPlatform('desktop')">
                <ion-button @click="dismiss()" class="btn-close">
                    <ion-icon :icon="closeOutline"></ion-icon>
                </ion-button>
            </ion-buttons>
            <ion-searchbar @ionInput="onSearch($event)" :debounce="250">
            </ion-searchbar>
        </ion-toolbar>
    </ion-header>
    <ion-content>

        <ion-item @click="dismiss()" tappable v-if="!props.query && props.selectedCountry">
            <ion-label>
                {{ props.selectedCountry[0] }} <span>+{{ props.selectedCountry[1] }}</span>
            </ion-label>
        </ion-item>

        <template v-for="(country, index) of props.countries" :key="index">
            <ion-item @click="dismiss(country)" tappable v-if="props.query || (props.selectedCountry[1] && country[1] != props.selectedCountry[1])">
                <ion-label>
                    {{ country[0] }} <span>+{{ country[1] }}</span>
                </ion-label>
            </ion-item>
        </template>

    </ion-content>
</template>
<script setup lang="ts">
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonSearchbar, IonToolbar, isPlatform, modalController, popoverController } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { onMounted, reactive } from 'vue';
 
const inputs = defineProps(['country_code']);

const props = reactive({
    allCountries: [],
    countries: [],
    selectedCountry: null,
    country_code: null,
    query: null
});

onMounted(() => {

    props.country_code = inputs.country_code;

    let CountryISO = [];
    CountryISO["Afghanistan"] = "af";
    CountryISO["Albania"] = "al";
    CountryISO["Algeria"] = "dz";
    CountryISO["AmericanSamoa"] = "as";
    CountryISO["Andorra"] = "ad";
    CountryISO["Angola"] = "ao";
    CountryISO["Anguilla"] = "ai";
    CountryISO["AntiguaAndBarbuda"] = "ag";
    CountryISO["Argentina"] = "ar";
    CountryISO["Armenia"] = "am";
    CountryISO["Aruba"] = "aw";
    CountryISO["Australia"] = "au";
    CountryISO["Austria"] = "at";
    CountryISO["Azerbaijan"] = "az";
    CountryISO["Bahamas"] = "bs";
    CountryISO["Bahrain"] = "bh";
    CountryISO["Bangladesh"] = "bd";
    CountryISO["Barbados"] = "bb";
    CountryISO["Belarus"] = "by";
    CountryISO["Belgium"] = "be";
    CountryISO["Belize"] = "bz";
    CountryISO["Benin"] = "bj";
    CountryISO["Bermuda"] = "bm";
    CountryISO["Bhutan"] = "bt";
    CountryISO["Bolivia"] = "bo";
    CountryISO["BosniaAndHerzegovina"] = "ba";
    CountryISO["Botswana"] = "bw";
    CountryISO["Brazil"] = "br";
    CountryISO["BritishIndianOceanTerritory"] = "io";
    CountryISO["BritishVirginIslands"] = "vg";
    CountryISO["Brunei"] = "bn";
    CountryISO["Bulgaria"] = "bg";
    CountryISO["BurkinaFaso"] = "bf";
    CountryISO["Burundi"] = "bi";
    CountryISO["Cambodia"] = "kh";
    CountryISO["Cameroon"] = "cm";
    CountryISO["Canada"] = "ca";
    CountryISO["CapeVerde"] = "cv";
    CountryISO["CaribbeanNetherlands"] = "bq";
    CountryISO["CaymanIslands"] = "ky";
    CountryISO["CentralAfricanRepublic"] = "cf";
    CountryISO["Chad"] = "td";
    CountryISO["Chile"] = "cl";
    CountryISO["China"] = "cn";
    CountryISO["ChristmasIsland"] = "cx";
    CountryISO["Cocos"] = "cc";
    CountryISO["Colombia"] = "co";
    CountryISO["Comoros"] = "km";
    CountryISO["CongoDRCJamhuriYaKidemokrasiaYaKongo"] = "cd";
    CountryISO["CongoRepublicCongoBrazzaville"] = "cg";
    CountryISO["CookIslands"] = "ck";
    CountryISO["CostaRica"] = "cr";
    CountryISO["C\u00F4teDIvoire"] = "ci";
    CountryISO["Croatia"] = "hr";
    CountryISO["Cuba"] = "cu";
    CountryISO["Cura\u00E7ao"] = "cw";
    CountryISO["Cyprus"] = "cy";
    CountryISO["CzechRepublic"] = "cz";
    CountryISO["Denmark"] = "dk";
    CountryISO["Djibouti"] = "dj";
    CountryISO["Dominica"] = "dm";
    CountryISO["DominicanRepublic"] = "do";
    CountryISO["Ecuador"] = "ec";
    CountryISO["Egypt"] = "eg";
    CountryISO["ElSalvador"] = "sv";
    CountryISO["EquatorialGuinea"] = "gq";
    CountryISO["Eritrea"] = "er";
    CountryISO["Estonia"] = "ee";
    CountryISO["Ethiopia"] = "et";
    CountryISO["FalklandIslands"] = "fk";
    CountryISO["FaroeIslands"] = "fo";
    CountryISO["Fiji"] = "fj";
    CountryISO["Finland"] = "fi";
    CountryISO["France"] = "fr";
    CountryISO["FrenchGuiana"] = "gf";
    CountryISO["FrenchPolynesia"] = "pf";
    CountryISO["Gabon"] = "ga";
    CountryISO["Gambia"] = "gm";
    CountryISO["Georgia"] = "ge";
    CountryISO["Germany"] = "de";
    CountryISO["Ghana"] = "gh";
    CountryISO["Gibraltar"] = "gi";
    CountryISO["Greece"] = "gr";
    CountryISO["Greenland"] = "gl";
    CountryISO["Grenada"] = "gd";
    CountryISO["Guadeloupe"] = "gp";
    CountryISO["Guam"] = "gu";
    CountryISO["Guatemala"] = "gt";
    CountryISO["Guernsey"] = "gg";
    CountryISO["Guinea"] = "gn";
    CountryISO["GuineaBissau"] = "gw";
    CountryISO["Guyana"] = "gy";
    CountryISO["Haiti"] = "ht";
    CountryISO["Honduras"] = "hn";
    CountryISO["HongKong"] = "hk";
    CountryISO["Hungary"] = "hu";
    CountryISO["Iceland"] = "is";
    CountryISO["India"] = "in";
    CountryISO["Indonesia"] = "id";
    CountryISO["Iran"] = "ir";
    CountryISO["Iraq"] = "iq";
    CountryISO["Ireland"] = "ie";
    CountryISO["IsleOfMan"] = "im";
    CountryISO["Israel"] = "il";
    CountryISO["Italy"] = "it";
    CountryISO["Jamaica"] = "jm";
    CountryISO["Japan"] = "jp";
    CountryISO["Jersey"] = "je";
    CountryISO["Jordan"] = "jo";
    CountryISO["Kazakhstan"] = "kz";
    CountryISO["Kenya"] = "ke";
    CountryISO["Kiribati"] = "ki";
    CountryISO["Kosovo"] = "xk";
    CountryISO["Kuwait"] = "kw";
    CountryISO["Kyrgyzstan"] = "kg";
    CountryISO["Laos"] = "la";
    CountryISO["Latvia"] = "lv";
    CountryISO["Lebanon"] = "lb";
    CountryISO["Lesotho"] = "ls";
    CountryISO["Liberia"] = "lr";
    CountryISO["Libya"] = "ly";
    CountryISO["Liechtenstein"] = "li";
    CountryISO["Lithuania"] = "lt";
    CountryISO["Luxembourg"] = "lu";
    CountryISO["Macau"] = "mo";
    CountryISO["Macedonia"] = "mk";
    CountryISO["Madagascar"] = "mg";
    CountryISO["Malawi"] = "mw";
    CountryISO["Malaysia"] = "my";
    CountryISO["Maldives"] = "mv";
    CountryISO["Mali"] = "ml";
    CountryISO["Malta"] = "mt";
    CountryISO["MarshallIslands"] = "mh";
    CountryISO["Martinique"] = "mq";
    CountryISO["Mauritania"] = "mr";
    CountryISO["Mauritius"] = "mu";
    CountryISO["Mayotte"] = "yt";
    CountryISO["Mexico"] = "mx";
    CountryISO["Micronesia"] = "fm";
    CountryISO["Moldova"] = "md";
    CountryISO["Monaco"] = "mc";
    CountryISO["Mongolia"] = "mn";
    CountryISO["Montenegro"] = "me";
    CountryISO["Montserrat"] = "ms";
    CountryISO["Morocco"] = "ma";
    CountryISO["Mozambique"] = "mz";
    CountryISO["Myanmar"] = "mm";
    CountryISO["Namibia"] = "na";
    CountryISO["Nauru"] = "nr";
    CountryISO["Nepal"] = "np";
    CountryISO["Netherlands"] = "nl";
    CountryISO["NewCaledonia"] = "nc";
    CountryISO["NewZealand"] = "nz";
    CountryISO["Nicaragua"] = "ni";
    CountryISO["Niger"] = "ne";
    CountryISO["Nigeria"] = "ng";
    CountryISO["Niue"] = "nu";
    CountryISO["NorfolkIsland"] = "nf";
    CountryISO["NorthKorea"] = "kp";
    CountryISO["NorthernMarianaIslands"] = "mp";
    CountryISO["Norway"] = "no";
    CountryISO["Oman"] = "om";
    CountryISO["Pakistan"] = "pk";
    CountryISO["Palau"] = "pw";
    CountryISO["Palestine"] = "ps";
    CountryISO["Panama"] = "pa";
    CountryISO["PapuaNewGuinea"] = "pg";
    CountryISO["Paraguay"] = "py";
    CountryISO["Peru"] = "pe";
    CountryISO["Philippines"] = "ph";
    CountryISO["Poland"] = "pl";
    CountryISO["Portugal"] = "pt";
    CountryISO["PuertoRico"] = "pr";
    CountryISO["Qatar"] = "qa";
    CountryISO["R\u00E9union"] = "re";
    CountryISO["Romania"] = "ro";
    CountryISO["Russia"] = "ru";
    CountryISO["Rwanda"] = "rw";
    CountryISO["SaintBarth\u00E9lemy"] = "bl";
    CountryISO["SaintHelena"] = "sh";
    CountryISO["SaintKittsAndNevis"] = "kn";
    CountryISO["SaintLucia"] = "lc";
    CountryISO["SaintMartin"] = "mf";
    CountryISO["SaintPierreAndMiquelon"] = "pm";
    CountryISO["SaintVincentAndTheGrenadines"] = "vc";
    CountryISO["Samoa"] = "ws";
    CountryISO["SanMarino"] = "sm";
    CountryISO["S\u00E3oTom\u00E9AndPr\u00EDncipe"] = "st";
    CountryISO["SaudiArabia"] = "sa";
    CountryISO["Senegal"] = "sn";
    CountryISO["Serbia"] = "rs";
    CountryISO["Seychelles"] = "sc";
    CountryISO["SierraLeone"] = "sl";
    CountryISO["Singapore"] = "sg";
    CountryISO["SintMaarten"] = "sx";
    CountryISO["Slovakia"] = "sk";
    CountryISO["Slovenia"] = "si";
    CountryISO["SolomonIslands"] = "sb";
    CountryISO["Somalia"] = "so";
    CountryISO["SouthAfrica"] = "za";
    CountryISO["SouthKorea"] = "kr";
    CountryISO["SouthSudan"] = "ss";
    CountryISO["Spain"] = "es";
    CountryISO["SriLanka"] = "lk";
    CountryISO["Sudan"] = "sd";
    CountryISO["Suriname"] = "sr";
    CountryISO["SvalbardAndJanMayen"] = "sj";
    CountryISO["Swaziland"] = "sz";
    CountryISO["Sweden"] = "se";
    CountryISO["Switzerland"] = "ch";
    CountryISO["Syria"] = "sy";
    CountryISO["Taiwan"] = "tw";
    CountryISO["Tajikistan"] = "tj";
    CountryISO["Tanzania"] = "tz";
    CountryISO["Thailand"] = "th";
    CountryISO["TimorLeste"] = "tl";
    CountryISO["Togo"] = "tg";
    CountryISO["Tokelau"] = "tk";
    CountryISO["Tonga"] = "to";
    CountryISO["TrinidadAndTobago"] = "tt";
    CountryISO["Tunisia"] = "tn";
    CountryISO["Turkey"] = "tr";
    CountryISO["Turkmenistan"] = "tm";
    CountryISO["TurksAndCaicosIslands"] = "tc";
    CountryISO["Tuvalu"] = "tv";
    CountryISO["USVirginIslands"] = "vi";
    CountryISO["Uganda"] = "ug";
    CountryISO["Ukraine"] = "ua";
    CountryISO["UnitedArabEmirates"] = "ae";
    CountryISO["UnitedKingdom"] = "gb";
    CountryISO["UnitedStates"] = "us";
    CountryISO["Uruguay"] = "uy";
    CountryISO["Uzbekistan"] = "uz";
    CountryISO["Vanuatu"] = "vu";
    CountryISO["VaticanCity"] = "va";
    CountryISO["Venezuela"] = "ve";
    CountryISO["Vietnam"] = "vn";
    CountryISO["WallisAndFutuna"] = "wf";
    CountryISO["WesternSahara"] = "eh";
    CountryISO["Yemen"] = "ye";
    CountryISO["Zambia"] = "zm";
    CountryISO["Zimbabwe"] = "zw";
    CountryISO["\u00C5landIslands"] = "ax";

    props.allCountries = [
        [
            'Afghanistan (‫افغانستان‬‎)',
            '93'
        ],
        [
            'Albania (Shqipëri)',
            '355'
        ],
        [
            'Algeria (‫الجزائر‬‎)',
            '213'
        ],
        [
            'American Samoa',
            '1',
            1,
            [
                '684',
            ]
        ],
        [
            'Andorra',
            '376'
        ],
        [
            'Angola',
            '244'
        ],
        [
            'Anguilla',
            '1',
            1,
            [
                '264',
            ]
        ],
        [
            'Antigua and Barbuda',
            '1',
            1,
            [
                '268',
            ]
        ],
        [
            'Argentina',
            '54'
        ],
        [
            'Armenia (Հայաստան)',
            '374'
        ],
        [
            'Aruba',
            '297'
        ],
        [
            'Australia',
            '61',
            0
        ],
        [
            'Austria (Österreich)',
            '43'
        ],
        [
            'Azerbaijan (Azərbaycan)',
            '994'
        ],
        [
            'Bahamas',
            'bs',
            '1',
            1,
            [
                '242',
            ]
        ],
        [
            'Bahrain (‫البحرين‬‎)',
            '973'
        ],
        [
            'Bangladesh (বাংলাদেশ)',
            '880'
        ],
        [
            'Barbados',
            '1',
            1,
            [
                '246',
            ]
        ],
        [
            'Belarus (Беларусь)',
            '375'
        ],
        [
            'Belgium (België)',
            '32'
        ],
        [
            'Belize',
            '501'
        ],
        [
            'Benin (Bénin)',
            '229'
        ],
        [
            'Bermuda',
            '1',
            1,
            [
                '441',
            ]
        ],
        [
            'Bhutan (འབྲུག)',
            '975'
        ],
        [
            'Bolivia',
            '591'
        ],
        [
            'Bosnia and Herzegovina (Босна и Херцеговина)',
            '387'
        ],
        [
            'Botswana',
            '267'
        ],
        [
            'Brazil (Brasil)',
            '55'
        ],
        [
            'British Indian Ocean Territory',
            '246'
        ],
        [
            'British Virgin Islands',
            '1',
            1,
            [
                '284',
            ]
        ],
        [
            'Brunei',
            '673'
        ],
        [
            'Bulgaria (България)',
            '359'
        ],
        [
            'Burkina Faso',
            '226'
        ],
        [
            'Burundi (Uburundi)',
            '257'
        ],
        [
            'Cambodia (កម្ពុជា)',
            '855'
        ],
        [
            'Cameroon (Cameroun)',
            '237'
        ],
        [
            'Canada',
            '1',
            1,
            [
                '204', '226', '236', '249', '250', '289', '306', '343', '365', '387', '403', '416',
                '418', '431', '437', '438', '450', '506', '514', '519', '548', '579', '581', '587',
                '604', '613', '639', '647', '672', '705', '709', '742', '778', '780', '782', '807',
                '819', '825', '867', '873', '902', '905'
            ]
        ],
        [
            'Cape Verde (Kabu Verdi)',
            '238'
        ],
        [
            'Caribbean Netherlands',
            '599',
            1
        ],
        [
            'Cayman Islands',
            '1',
            1,
            [
                '345',
            ]
        ],
        [
            'Central African Republic (République centrafricaine)',
            '236'
        ],
        [
            'Chad (Tchad)',
            '235'
        ],
        [
            'Chile',
            '56'
        ],
        [
            'China (中国)',
            '86'
        ],
        [
            'Christmas Island',
            '61',
            2
        ],
        [
            'Cocos (Keeling) Islands',
            '61',
            1
        ],
        [
            'Colombia',
            '57'
        ],
        [
            'Comoros (‫جزر القمر‬‎)',
            '269'
        ],
        [
            'Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)',
            '243'
        ],
        [
            'Congo (Republic) (Congo-Brazzaville)',
            '242'
        ],
        [
            'Cook Islands',
            '682'
        ],
        [
            'Costa Rica',
            '506'
        ],
        [
            'Côte d’Ivoire',
            '225'
        ],
        [
            'Croatia (Hrvatska)',
            '385'
        ],
        [
            'Cuba',
            '53'
        ],
        [
            'Curaçao',
            '599',
            0
        ],
        [
            'Cyprus (Κύπρος)',
            '357'
        ],
        [
            'Czech Republic (Česká republika)',
            '420'
        ],
        [
            'Denmark (Danmark)',
            '45'
        ],
        [
            'Djibouti',
            '253'
        ],
        [
            'Dominica',
            '1767'
        ],
        [
            'Dominican Republic (República Dominicana)',
            '1',
            2,
            ['809', '829', '849']
        ],
        [
            'Ecuador',
            '593'
        ],
        [
            'Egypt (‫مصر‬‎)',
            '20'
        ],
        [
            'El Salvador',
            '503'
        ],
        [
            'Equatorial Guinea (Guinea Ecuatorial)',
            '240'
        ],
        [
            'Eritrea',
            '291'
        ],
        [
            'Estonia (Eesti)',
            '372'
        ],
        [
            'Ethiopia',
            '251'
        ],
        [
            'Falkland Islands (Islas Malvinas)',
            '500'
        ],
        [
            'Faroe Islands (Føroyar)',
            '298'
        ],
        [
            'Fiji',
            '679'
        ],
        [
            'Finland (Suomi)',
            '358',
            0
        ],
        [
            'France',
            '33'
        ],
        [
            'French Guiana (Guyane française)',
            '594'
        ],
        [
            'French Polynesia (Polynésie française)',
            '689'
        ],
        [
            'Gabon',
            '241'
        ],
        [
            'Gambia',
            '220'
        ],
        [
            'Georgia (საქართველო)',
            '995'
        ],
        [
            'Germany (Deutschland)',
            '49'
        ],
        [
            'Ghana (Gaana)',
            '233'
        ],
        [
            'Gibraltar',
            '350'
        ],
        [
            'Greece (Ελλάδα)',
            '30'
        ],
        [
            'Greenland (Kalaallit Nunaat)',
            '299'
        ],
        [
            'Grenada',
            '1473'
        ],
        [
            'Guadeloupe',
            '590',
            0
        ],
        [
            'Guam',
            '1',
            1,
            [
                '671',
            ]
        ],
        [
            'Guatemala',
            '502'
        ],
        [
            'Guernsey',
            '44',
            1,
            [1481]
        ],
        [
            'Guinea (Guinée)',
            '224'
        ],
        [
            'Guinea-Bissau (Guiné Bissau)',
            '245'
        ],
        [
            'Guyana',
            '592'
        ],
        [
            'Haiti',
            '509'
        ],
        [
            'Honduras',
            '504'
        ],
        [
            'Hong Kong (香港)',
            '852'
        ],
        [
            'Hungary (Magyarország)',
            '36'
        ],
        [
            'Iceland (Ísland)',
            '354'
        ],
        [
            'India (भारत)',
            '91'
        ],
        [
            'Indonesia',
            '62'
        ],
        [
            'Iran (‫ایران‬‎)',
            '98'
        ],
        [
            'Iraq (‫العراق‬‎)',
            '964'
        ],
        [
            'Ireland',
            '353'
        ],
        [
            'Isle of Man',
            '44',
            2,
            [1624]
        ],
        [
            'Israel (‫ישראל‬‎)',
            '972'
        ],
        [
            'Italy (Italia)',
            '39',
            0
        ],
        [
            'Jamaica',
            '1',
            1,
            [
                '876',
            ]
        ],
        [
            'Japan (日本)',
            '81'
        ],
        [
            'Jersey',
            '44',
            3,
            [1534]
        ],
        [
            'Jordan (‫الأردن‬‎)',
            '962'
        ],
        [
            'Kazakhstan (Казахстан)',
            '7',
            1
        ],
        [
            'Kenya',
            '254'
        ],
        [
            'Kiribati',
            '686'
        ],
        [
            'Kosovo',
            '383'
        ],
        [
            'Kuwait (‫الكويت‬‎)',
            '965'
        ],
        [
            'Kyrgyzstan (Кыргызстан)',
            '996'
        ],
        [
            'Laos (ລາວ)',
            '856'
        ],
        [
            'Latvia (Latvija)',
            '371'
        ],
        [
            'Lebanon (‫لبنان‬‎)',
            '961'
        ],
        [
            'Lesotho',
            '266'
        ],
        [
            'Liberia',
            '231'
        ],
        [
            'Libya (‫ليبيا‬‎)',
            '218'
        ],
        [
            'Liechtenstein',
            '423'
        ],
        [
            'Lithuania (Lietuva)',
            '370'
        ],
        [
            'Luxembourg',
            '352'
        ],
        [
            'Macau (澳門)',
            '853'
        ],
        [
            'Macedonia (FYROM) (Македонија)',
            '389'
        ],
        [
            'Madagascar (Madagasikara)',
            '261'
        ],
        [
            'Malawi',
            '265'
        ],
        [
            'Malaysia',
            '60'
        ],
        [
            'Maldives',
            '960'
        ],
        [
            'Mali',
            '223'
        ],
        [
            'Malta',
            '356'
        ],
        [
            'Marshall Islands',
            '692'
        ],
        [
            'Martinique',
            '596'
        ],
        [
            'Mauritania (‫موريتانيا‬‎)',
            '222'
        ],
        [
            'Mauritius (Moris)',
            '230'
        ],
        [
            'Mayotte',
            '262',
            1
        ],
        [
            'Mexico (México)',
            '52'
        ],
        [
            'Micronesia',
            '691'
        ],
        [
            'Moldova (Republica Moldova)',
            '373'
        ],
        [
            'Monaco',
            '377'
        ],
        [
            'Mongolia (Монгол)',
            '976'
        ],
        [
            'Montenegro (Crna Gora)',
            '382'
        ],
        [
            'Montserrat',
            '1',
            1,
            [
                '664',
            ]
        ],
        [
            'Morocco (‫المغرب‬‎)',
            '212',
            0
        ],
        [
            'Mozambique (Moçambique)',
            '258'
        ],
        [
            'Myanmar (Burma) (မြန်မာ)',
            '95'
        ],
        [
            'Namibia (Namibië)',
            '264'
        ],
        [
            'Nauru',
            '674'
        ],
        [
            'Nepal (नेपाल)',
            '977'
        ],
        [
            'Netherlands (Nederland)',
            '31'
        ],
        [
            'New Caledonia (Nouvelle-Calédonie)',
            '687'
        ],
        [
            'New Zealand',
            '64'
        ],
        [
            'Nicaragua',
            '505'
        ],
        [
            'Niger (Nijar)',
            '227'
        ],
        [
            'Nigeria',
            '234'
        ],
        [
            'Niue',
            '683'
        ],
        [
            'Norfolk Island',
            '672'
        ],
        [
            'North Korea (조선 민주주의 인민 공화국)',
            '850'
        ],
        [
            'Northern Mariana Islands',
            '1670'
        ],
        [
            'Norway (Norge)',
            '47',
            0
        ],
        [
            'Oman (‫عُمان‬‎)',
            '968'
        ],
        [
            'Pakistan (‫پاکستان‬‎)',
            '92'
        ],
        [
            'Palau',
            '680'
        ],
        [
            'Palestine (‫فلسطين‬‎)',
            '970'
        ],
        [
            'Panama (Panamá)',
            '507'
        ],
        [
            'Papua New Guinea',
            '675'
        ],
        [
            'Paraguay',
            '595'
        ],
        [
            'Peru (Perú)',
            '51'
        ],
        [
            'Philippines',
            '63'
        ],
        [
            'Poland (Polska)',
            '48'
        ],
        [
            'Portugal',
            '351'
        ],
        [
            'Puerto Rico',
            '1',
            3,
            ['787', '939']
        ],
        [
            'Qatar (‫قطر‬‎)',
            '974'
        ],
        [
            'Réunion (La Réunion)',
            '262',
            0
        ],
        [
            'Romania (România)',
            '40'
        ],
        [
            'Russia (Россия)',
            '7',
            0
        ],
        [
            'Rwanda',
            '250'
        ],
        [
            'Saint Barthélemy (Saint-Barthélemy)',
            '590',
            1
        ],
        [
            'Saint Helena',
            '290'
        ],
        [
            'Saint Kitts and Nevis',
            '1869'
        ],
        [
            'Saint Lucia',
            '1',
            1,
            [
                '758',
            ]
        ],
        [
            'Saint Martin (Saint-Martin (partie française))',
            '590',
            2
        ],
        [
            'Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)',
            '508'
        ],
        [
            'Saint Vincent and the Grenadines',
            '1',
            1,
            [
                '784',
            ]
        ],
        [
            'Samoa',
            '685'
        ],
        [
            'San Marino',
            '378'
        ],
        [
            'São Tomé and Príncipe (São Tomé e Príncipe)',
            '239'
        ],
        [
            'Saudi Arabia (‫المملكة العربية السعودية‬‎)',
            '966'
        ],
        [
            'Senegal (Sénégal)',
            '221'
        ],
        [
            'Serbia (Србија)',
            '381'
        ],
        [
            'Seychelles',
            '248'
        ],
        [
            'Sierra Leone',
            '232'
        ],
        [
            'Singapore',
            '65'
        ],
        [
            'Sint Maarten',
            '1',
            1,
            [
                '721',
            ]
        ],
        [
            'Slovakia (Slovensko)',
            '421'
        ],
        [
            'Slovenia (Slovenija)',
            '386'
        ],
        [
            'Solomon Islands',
            '677'
        ],
        [
            'Somalia (Soomaaliya)',
            '252'
        ],
        [
            'South Africa',
            '27'
        ],
        [
            'South Korea (대한민국)',
            '82'
        ],
        [
            'South Sudan (‫جنوب السودان‬‎)',
            '211'
        ],
        [
            'Spain (España)',
            '34'
        ],
        [
            'Sri Lanka (ශ්‍රී ලංකාව)',
            '94'
        ],
        [
            'Sudan (‫السودان‬‎)',
            '249'
        ],
        [
            'Suriname',
            '597'
        ],
        [
            'Svalbard and Jan Mayen',
            '47',
            1
        ],
        [
            'Swaziland',
            '268'
        ],
        [
            'Sweden (Sverige)',
            '46'
        ],
        [
            'Switzerland (Schweiz)',
            '41'
        ],
        [
            'Syria (‫سوريا‬‎)',
            '963'
        ],
        [
            'Taiwan (台灣)',
            '886'
        ],
        [
            'Tajikistan',
            '992'
        ],
        [
            'Tanzania',
            '255'
        ],
        [
            'Thailand (ไทย)',
            '66'
        ],
        [
            'Timor-Leste',
            '670'
        ],
        [
            'Togo',
            '228'
        ],
        [
            'Tokelau',
            '690'
        ],
        [
            'Tonga',
            '676'
        ],
        [
            'Trinidad and Tobago',
            'tt',
            '1',
            1,
            [
                '868',
            ]
        ],
        [
            'Tunisia (‫تونس‬‎)',
            '216'
        ],
        [
            'Turkey (Türkiye)',
            '90'
        ],
        [
            'Turkmenistan',
            '993'
        ],
        [
            'Turks and Caicos Islands',
            '1649'
        ],
        [
            'Tuvalu',
            '688'
        ],
        [
            'U.S. Virgin Islands',
            '1',
            1,
            [
                '340',
            ]
        ],
        [
            'Uganda',
            '256'
        ],
        [
            'Ukraine (Україна)',
            '380'
        ],
        [
            'United Arab Emirates (‫الإمارات العربية المتحدة‬‎)',
            '971'
        ],
        [
            'United Kingdom',
            '44',
            0
        ],
        [
            'United States',
            '1',
            0
        ],
        [
            'Uruguay',
            '598'
        ],
        [
            'Uzbekistan (Oʻzbekiston)',
            '998'
        ],
        [
            'Vanuatu',
            '678'
        ],
        [
            'Vatican City (Città del Vaticano)',
            '39',
            1
        ],
        [
            'Venezuela',
            '58'
        ],
        [
            'Vietnam (Việt Nam)',
            '84'
        ],
        [
            'Wallis and Futuna',
            '681'
        ],
        [
            'Western Sahara (‫الصحراء الغربية‬‎)',
            '212',
            1
        ],
        [
            'Yemen (‫اليمن‬‎)',
            '967'
        ],
        [
            'Zambia',
            '260'
        ],
        [
            'Zimbabwe',
            '263'
        ],
        [
            'Åland Islands',
            '358',
            1
        ]
    ];

    props.countries = props.allCountries;

    props.selectedCountry = props.countries.find(c => c[1] == props.country_code);
});

function onSearch(event) {
    props.query = event.target.value;
    const q = event.target.value;
    props.countries = props.allCountries.filter(e => {
        return e[0].includes(q) || e[0].toLowerCase().includes(q) ||
            e[1].includes(q) || e[1].toLowerCase().includes(q);
    })
}

function dismiss(country = null) {
    if (isPlatform('desktop')) {
        popoverController.dismiss({
            country: country
        });
    } else {
        modalController.dismiss({
            country: country
        });
    }
}

</script>
<style lang="scss" scoped>
ion-item {
    ion-label {
        white-space: no-wrap;

        span {
            float: var(--end);
            color: grey;
        }
    }
}

.btn-close {
    ion-icon {
        font-size: 22px;
    }
}
</style>