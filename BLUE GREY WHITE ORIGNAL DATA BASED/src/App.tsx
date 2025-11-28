import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle, XCircle, RotateCcw, User, UserPlus, Trash2, LogOut, AlertTriangle, Shield, BookOpen, Plus } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  type?: 'normal' | 'match-pair' | 'statement';
  columnAItems?: string[];
  columnBItems?: string[];
  statement1?: string;
  statement2?: string;
  image?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}

interface ShuffledQuestion extends Question {
  shuffledOptions: { text: string; originalKey: string }[];
  correctIndex: number;
}

interface Test {
  id: string;
  name: string;
  description: string;
  duration: number;
  questions: Question[]; // Keep the full question list for selection
}

interface UserAccount {
  email: string;
  password: string;
  role: 'admin' | 'student';
}

const ADMIN_EMAIL = 'admin@jee.com';
const ADMIN_PASSWORD = 'admin123';

const initialAccounts: UserAccount[] = [
  { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' },
  { email: 'test@gmail.com', password: 'test123', role: 'student' },
];

// Your large question pool (sampleQuestions)
const sampleQuestions: Question[] = [
{ id: 1, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1y9-GEc4S1jDyS1WNL5OqFTRWoibym8L9&sz=w1000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 2, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1VypMXlWqcUFk3AHY15R5QQsr-xKhB0RZ&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 3, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1g1NuHqJrUZVkwN14484udRStI-8_hMIE&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 4, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1esGjNMzajetl-BrKhQUnAYoxY4jDy6Lq&sz=w1000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 5, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=183VWs6PZFsWQAgEMmRqlRRxsqpqed_Yb&sz=w1000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 6, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1RU_qpgh_Yy-w5OXzjhnJuE-obYSw5Umv&sz=w1000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 7, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1rO8wSalEivEH_PI1jjooc0mRq6zl0wM3&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 8, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1SasY_kxIm--jquZolsp1WQ88sWHEPP7t&sz=w1000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 9, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1O_6FpeJkAk0iWM_qZwVC2zZ-qX9oeA85&sz=w1000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 10, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1RK3pH9UstXGy2lHhzMrKMu8f2zRirMqc&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 11, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1m0OD2ilJbLshhBaaxyUq2Wa4Wu3p6NzK&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 12, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1vVlM4PW5sDYqHFvP0uUtyFOISQukyuRo&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 13, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=11JdQCUHE7G8YsCDnX3QET26wriSxzu_g&sz=w1000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 14, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1eEkYC62dfhc4BGeHRpZLHHJrcoMwYqDv&sz=w1000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 15, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1pqnDJ1JPTSHu6Z2Bbu2XyxSfDo5PRvqS&sz=w1000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 16, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1QXocpweOsbgXMIm_LLQhzPT_y8fjysbm&sz=w1000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 17, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=14ooAQ8T53l0iph1imesi3zNHmAyFavxN&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 18, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oLpMJJVz3ar8i_8vG2IAAJEucxrmnB9U&sz=w1000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 19, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1m_KGPW6dMnCQ1PyfQrI3F-3qxaK29f3L&sz=w1000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 20, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1hYG_KZWsmdDwSyHCaHuRVsJJFUWoFysQ&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 21, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1tRCsqC7-9s76pDz_lfJGYmQ4fMvQawlA&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 22, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1x8lqczFMZ796GisgSn3kFVbdsfQS0_sE&sz=w1000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 23, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1jLjcPdxlyIS7GE6dxObjN_4qHOmi2pQ6&sz=w1000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 24, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1DZRHMjR3OOX9bs_aPgAoHOwok7eFR6xP&sz=w1000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 25, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1fAB4CSVWfeyiykrJJw02Az_4sE4Ie8NR&sz=w1000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 26, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1FgJknVGgdB7I41fzwLENV5twjkinU5cR&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 27, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=11cLxQNh2WN55OBvTZ42qfQnjEqezr0SJ&sz=w1000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 28, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1JY6QUP_PWNr4C-seIybAr6mDLl3-PtyF&sz=w1000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 29, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ZxfJOcu-2zqdKnYOmZcSMYvpCiNMwe0m&sz=w1000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 30, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=16kZyqGgAQhw7dipSnewVA7-Dybc9NqOF&sz=w1000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 31, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Xpt4YMo8KDpqUOcEIcEw2QxMJ4klomWD&sz=w1000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 32, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1gLV3OzQjZJXYSDWqaryQrU167P503ONL&sz=w1000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 33, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1sYz9X_Q_Hfrd2bFrZAOZodelHHdrw3tl&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 34, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1_Min3hbZ8oqBlklB-9muqLj0XKX2jdUM&sz=w1000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 35, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1h6NKOan28Oj984Po1E9R2GGNfRAILyrD&sz=w1000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 36, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=12SSfmqi0BxeHjj6TGrfTvpsE_RjzhVih&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 37, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1eUjVa7v_ON7N6s_qfEn0PRpt6tlZg0Nh&sz=w1000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 38, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nVDvolkMBU5QnCu4ZXje5fKtj99ljcAs&sz=w1000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 39, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1wCFi9rQOalR-ywFlazS9mbE7gUp3Upoi&sz=w1000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 40, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1TCW7C9tbN9Ws1TyylcKhxRsCmU9T_AwF&sz=w1000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 41, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=19JYrLFSFg08Hxg4k40euxlKctlqRoNLa&sz=w1000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 42, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1fu0j-xT12g6vT_HoZ7GqYpPUWiDmcp_N&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 43, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1UsmoIMZxUn48fFR4ZlZqKaQSd-OldWg4&sz=w1000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 44, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1xezvzlWJ81q1Rc_lhxmykRiMRVVCm6zF&sz=w1000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 45, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Pw8aavzx2Rz_oSr_fiJmf50s1jIQKKw5&sz=w1000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 46, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Q4qTzI2x5tkw4OCdihq7PF-yfkskIueU&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 47, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1oRfvIWl7vg2-d_CsDdJsVrjUSZ5AJYaI&sz=w1000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 48, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1-gdOS-wTg3k2gvntbeFHD2G6MaBAIhTi&sz=w1000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 49, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1QbMImyiuiUIXdkd-hILGWlQ_jyrfuZkH&sz=w1000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 50, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Yt_e3KTNJ51UaG6_NTM23YCjCyKMTfEd&sz=w1000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 1, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1HjoCItNJHVYDjmjM5o_rJRDr-t5eyyCz&sz=w1000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 2, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1fgq9s75ez3fUlL3aZTlwdjws-RP4hjWO&sz=w1000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 3, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1rLplkT8y2V4J63VE0jWbzqhFsr6y7EOK&sz=w1000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 4, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1uXcz2_65iL8iSX-hvuzFIifDqb2_GLVl&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 5, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1t1dzGAWGPpLveM8Yw4tGWtGeMCns0BRE&sz=w1000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 6, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1MCdrAfeSfxjvWJk2EuXjn0UNPHwESF8M&sz=w1000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 7, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1PFyqD_30ZXxSUfCsd8P4I9Uo-8VDPrfN&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 8, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1bQbJTBAVWhSSpUJZfO5STSjQjIBlkvlg&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 9, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=11PV4UstV_CtKeWZ4s8_DgOI6eDo5Hj5H&sz=w1000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 10, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1JYwnrRE2LSUYqybtPXQvxQy5ARPxdzXk&sz=w1000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 11, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1BGkIPLvyVpIkej-jhcZkIhlXVOpg0VWR&sz=w1000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 12, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1_mkK9HAUNqXLN4XOdS3Hssh9VQIwP-oY&sz=w1000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 13, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=15ZxBjeBwFV-RR9nHDVFq5UqrRymRaaTe&sz=w1000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 14, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1LaldYNoTv_nPM2cAPl0E51GFajwq-DUL&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 15, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=17_qw1EzANGR28X3XPUiQT4yH8oXVAvp5&sz=w1000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 16, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=16HIN4nlmcRTASg9sBAKi6tcMq3f_SXPu&sz=w1000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 17, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=11Qgxr_BQ7pXCcbaSaIy1im5qoooU9jAq&sz=w1000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 18, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1CxLGybHxyFJSvrwsI48XFWtWGfe8eNBO&sz=w1000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 19, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1nr3lhVanVvBvvcsyrP-JrbFQRER2SfOO&sz=w1000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 20, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1lIJ_4MEQOx9jn0ReKEs2JkN2fyLrhmPd&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 21, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1fsoxZS1n1sqUEHWptCCEBq28it5Pb94i&sz=w1000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 22, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1vdG63qSFgzzcI4KnSuss_-cr7I3IS-s1&sz=w1000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 23, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=11XvViKBYYJUxh2Gm-V46o72_x7Z8pLy8&sz=w1000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 24, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1sIuJ_39cJi0tTir7Yut8LsFoioACNJi5&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 25, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1psECEASUDBkVdTN6OzDnXn4sclC3JcNX&sz=w1000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 26, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1uYTQ3t381TNct8VoC1E-QhhpbsqPFYwR&sz=w1000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 27, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=17A0PbI1Eyatv6qsdXm2aW9WCGpYrtTMd&sz=w1000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 28, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1I7ZrJ0kT2A7Hg5RjJO6nuU7_C76EfO-v&sz=w1000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 29, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1jNoOxM_fIgE2QmG_4C8gVM6o-jaQXn98&sz=w1000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 30, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=10DhusdwDWnFjzIC83YN3iNPvovqa4jUK&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 31, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1csyNGCodnZd_XCbZ-3ghIWVgAulPclk8&sz=w1000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 32, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1A9Et6wpYsQvjBh2_f5Zcg00x5rnxzwiY&sz=w1000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 33, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Ac9L7Yj0AiOGVTpFJMj2u1kQ6x5B4UGN&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 34, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1hJLV-cnsOBuHfy4U7X_6UrF4wD_Ud2Mm&sz=w1000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 35, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1_rbKuXn32UlXXuWiwWtRI-mIf2JyEyah&sz=w1000", optionA: "c", optionB: "d", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 36, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1sv14leYhF685h_ZIdkQKiKMjgJRJ-OBd&sz=w1000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 37, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1H4wdWCCJHxGAUopKu3fJEi8Lv7LBltxL&sz=w1000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 38, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=13OuC0B59-DxD3sPDqj4mu3xlRqgxN2-Z&sz=w1000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 39, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1mEeiCSOmpAgdMr19g9-8pDSVN160GLxq&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 40, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=16fE-xv_E-5FzhQo1-vxNvYuEYy9bgcl6&sz=w1000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 41, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1JXFQMh3QNjL5Hh9wzNygaYNfOXxTwJhG&sz=w1000", optionA: "b", optionB: "c", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 42, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1TJU9b8G754YgxVxJC9mseWTh_PrX2tDy&sz=w1000", optionA: "d", optionB: "c", optionC: "b", optionD: "a", correctOption: "d" },
{ id: 43, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1RG1c0_E7NFAoA5HOkuFV4eHARaOmG-9V&sz=w1000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 44, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1hOGo1zGvVg3W9Li7WOenTVYSmtwA4U_Y&sz=w1000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 45, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1fudA7rUooMuJMbdN3K-qQMP3V9uyizcW&sz=w1000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 46, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1XL9YT2bmTd2wifD9Ig-4Z1GybEMKdyjX&sz=w1000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 47, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1FRAfggfOg4OwJgv8hBaTilDph3yO436J&sz=w1000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 48, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=17HjTJv0upxtOpBTNhu6ns0vtIwtht7z0&sz=w1000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 49, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1MIvQTEuyyYfSwjjAAQaGXgmJhsTqDNxp&sz=w1000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 50, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1XfJDT5iHUYw8QSL-xV1RAZrHln7ZGFzi&sz=w1000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 1, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Xwl2kAQXHaO97oW7g2ujMK_JhKwhEUEQ&sz=w1000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 2, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1TkPfaoJVl3qonoI2R-hKWecc9DZ_Xuk8&sz=w1000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 3, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1MP0My-79oay0Sfzx8IJJuJF8NMVdgjlX&sz=w1000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 4, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Bjo0fbM7fi6PWsdlLrWeaiczurWoCwpJ&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 5, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1zFnXr2kPTbdoiGLdw8FPPkK7mB3GfV_u&sz=w1000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 6, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1jjRNT16ADolpd-nWmw9qiFl4ZaYLpCpH&sz=w1000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 7, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1KBZLIqNyex2zBLjzl5UQ5AIgMKqKa-S7&sz=w1000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 8, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1I21_BsKPl4QPTeV0whryNII07DcIn6xS&sz=w1000", optionA: "a", optionB: "c", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 9, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=14xOltu_8GMUO75vk3IzNIMeItE9uBC1V&sz=w1000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 10, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Boj2HnaH8fA8f4G6qi8JLeRNPEMMw7uy&sz=w1000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 11, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1y0XvqTqjGdy_Pdon4VS_V3vlMS1MpHFS&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 12, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1fuA4pZn0QG_XnM_3Gv1DaUMn6ng6e3hq&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 13, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1cEEnp_dcSTtmILcMr7LgfxxvWvrFW3cZ&sz=w1000", optionA: "b", optionB: "d", optionC: "f", optionD: "c", correctOption: "d" },
{ id: 14, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Pi7XaJPMwLml0k_6f8FqQao2lBb9_9Jq&sz=w1000", optionA: "c", optionB: "b", optionC: "a", optionD: "d", correctOption: "d" },
{ id: 15, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1HUs4YYImhe1QwVGnNLWQ3UH8i6hS2jv8&sz=w1000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 16, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1F78_8VlPvHS65_DisTqbgDkX9rLlAu2Y&sz=w1000", optionA: "b", optionB: "c", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 17, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1NNIYBqXcJpld0JliyoyBU4tSP3__flgK&sz=w1000", optionA: "d", optionB: "c", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 18, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Sf_3q9Q6j915JuDiG_YUDXLtZfEXmC22&sz=w1000", optionA: "c", optionB: "a", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 19, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=16hH59B2IHrdL7vXvsQXgjjo0RBAnXhcN&sz=w1000", optionA: "c", optionB: "b", optionC: "d", optionD: "a", correctOption: "d" },
{ id: 20, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1KfTNdf_3MFhjbKvPmdzs9UKrBNXKx-2P&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 21, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1xmI6w_uhDKt-BNyLRBVfNDrxNvBTom0h&sz=w1000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 22, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1zjaIlfdKJoD2OXMKqKq2R8KoEIa8ayRh&sz=w1000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 23, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1O3xRoFTIth-M_X69jft5wCisjFrZMXK0&sz=w1000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 24, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1EzvGho6B3sv1ilTUo8Za4NXXnmil0V36&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 25, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Ailmk7MaX7F_wHzn7rdklm56xiqK4S9b&sz=w1000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 26, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1SmlxhefFLqGsdY-ldbXqk7FTuWAJvw6-&sz=w1000", optionA: "c", optionB: "a", optionC: "b", optionD: "d", correctOption: "d" },
{ id: 27, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1DUVZv8NPM7bxfP-OR1ORkpcGDzvvqBUk&sz=w1000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 28, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1kwUUhqGigiHRopZ7OLn-aAQ3EgzJmrmY&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 29, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1MI88VtDvJ13G76BnIipZhAULdI3EDwNR&sz=w1000", optionA: "d", optionB: "a", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 30, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Fs7aMPY8pDdlie3Dc3LMMdvO3kTAAa45&sz=w1000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 31, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Vh7TEhrzvUEOgBSNFksvHYN9EcEHKjFl&sz=w1000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 32, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=175zEzxDnJCwi3ensfqtsa_W3sam-DreX&sz=w1000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 33, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1ZqyjInVmiPKFRABd0ttlm_VAAhvAH4EG&sz=w1000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 34, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1A_zYY79ogvhQvOTdj6vqOjlyulqYisVV&sz=w1000", optionA: "a", optionB: "c", optionC: "d", optionD: "b", correctOption: "d" },
{ id: 35, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1b0XOYm1Fd0zqttANG1NKIiY_HmxETCWR&sz=w1000", optionA: "d", optionB: "a", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 36, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1AuVMe_CYjNp5Jf4yiqtqG909dPps_pwI&sz=w1000", optionA: "d", optionB: "b", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 37, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1NnfK3XAaIFgbnVyH4GYifkoypgd0Hpbr&sz=w1000", optionA: "d", optionB: "b", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 38, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1vZ6Jt2OYscTVVeUS9T4YY-q0qRN5z2ww&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 39, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1A9LM-CVK3H-kA4rcnrHlZX8-MWgjr0Pj&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 40, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=15L814MmA_s2q-92UTYy_9rzUdLVqgxCv&sz=w1000", optionA: "b", optionB: "a", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 41, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1Rac5qX4vSfP1tXl7qSbk9YNvzUz7xZbi&sz=w1000", optionA: "b", optionB: "d", optionC: "a", optionD: "c", correctOption: "d" },
{ id: 42, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1GO9JoHVahX2dKfch2_tLcgwxW72zUMwZ&sz=w1000", optionA: "b", optionB: "d", optionC: "c", optionD: "a", correctOption: "d" },
{ id: 43, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1KrUVpHEq0huA1l6bgnuSRrBskkc1vier&sz=w1000", optionA: "a", optionB: "b", optionC: "c", optionD: "d", correctOption: "d" },
{ id: 44, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1A4TUlRBiQjTNwvpTcHN6UzFZYs-Eofs1&sz=w1000", optionA: "c", optionB: "d", optionC: "a", optionD: "b", correctOption: "d" },
{ id: 45, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1RoiwmOj-YNQP4fOtA3X0-PDIpBulgU4f&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 46, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1C6pOWfO106iGt1KrLf6oIREqJdYPDwlj&sz=w1000", optionA: "a", optionB: "d", optionC: "b", optionD: "c", correctOption: "d" },
{ id: 47, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1P4Pp4VC2tS8MBNGH5rGZUymlumTmAd__&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 48, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1jV95PqPNg3PXPYadgzlOGOPqSFn96NHe&sz=w1000", optionA: "a", optionB: "d", optionC: "c", optionD: "b", correctOption: "d" },
{ id: 49, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1vakzFTBJDHRvyyxGviL9NjrMvtdzsVGv&sz=w1000", optionA: "b", optionB: "a", optionC: "d", optionD: "c", correctOption: "d" },
{ id: 50, question: "Read the Instructions Carefully", image: "https://drive.google.com/thumbnail?id=1z89wf9Y0ZpAs4Pl-hxmGpw6l0sqVaaet&sz=w1000", optionA: "a", optionB: "b", optionC: "d", optionD: "c", correctOption: "d" }
  ];

// Default test duration in seconds (e.g., 60 minutes)
const DEFAULT_TEST_DURATION = 3600;

// Define your initial tests using slices of the sampleQuestions array
const initialTests: Test[] = [
  // ---------------- WHITE MOCK TESTS (1–8) ----------------
  { id: 'White Mock Test 1', name: 'White Mock Test 1', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(0, 50) },
  { id: 'White Mock Test 2', name: 'White Mock Test 2', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(50, 100) },
  { id: 'White Mock Test 3', name: 'White Mock Test 3', description: 'Mock test based on Actual PYQ', duration: DEFAULT_TEST_DURATION, questions: sampleQuestions.slice(100, 150) }
  

  // Add more initial tests as needed, manually defining the slice for each
];

function shuffleOptions(question: Question): ShuffledQuestion {
  const options = [
    { text: question.optionA, originalKey: 'a' },
    { text: question.optionB, originalKey: 'b' },
    { text: question.optionC, originalKey: 'c' },
    { text: question.optionD, originalKey: 'd' }
  ];
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const correctIndex = shuffled.findIndex(opt => opt.originalKey === question.correctOption);
  return {
    ...question,
    shuffledOptions: shuffled,
    correctIndex
  };
}

export default function MockTestPortal() {
  const [accounts, setAccounts] = useState<UserAccount[]>(initialAccounts);
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TEST_DURATION);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0); // New state for fullscreen exits
  const containerRef = useRef<HTMLDivElement>(null);
  const [newTestName, setNewTestName] = useState('');
  const [newTestDesc, setNewTestDesc] = useState('');
  const [newTestDuration, setNewTestDuration] = useState('10');

  const addViolation = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setViolations(prev => [...prev, `${timestamp}: ${message}`]);
    setWarningMessage(message);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  useEffect(() => {
    if (!testStarted) return;
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addViolation('Right-click detected');
    };
    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, [testStarted]);

  useEffect(() => {
    if (!testStarted) return;
    const preventShortcuts = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        addViolation('Screenshot attempt detected');
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        addViolation('Screenshot attempt detected');
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        addViolation('Screenshot attempt detected');
      }
      if (e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault();
        addViolation('DevTools access attempt');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        addViolation('Print attempt detected');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        addViolation('Save attempt detected');
      }
    };
    document.addEventListener('keydown', preventShortcuts);
    document.addEventListener('keyup', preventShortcuts);
    return () => {
      document.removeEventListener('keydown', preventShortcuts);
      document.removeEventListener('keyup', preventShortcuts);
    };
  }, [testStarted]);

  useEffect(() => {
    if (!testStarted || testCompleted) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        addViolation('Tab switched or window minimized');
      }
    };
    const handleBlur = () => {
      setTabSwitchCount(prev => prev + 1);
      addViolation('Focus lost from test window');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [testStarted, testCompleted]);

  useEffect(() => {
    if (!testStarted || testCompleted) return;
    const enterFullscreen = () => {
      if (containerRef.current && !document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {
          addViolation('Fullscreen denied by user');
          // If denied, count as an exit attempt
          setFullscreenExitCount(prev => prev + 1);
        });
      }
    };
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement && testStarted && !testCompleted) {
        setFullscreenExitCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) { // Threshold for automatic submission
            addViolation('Fullscreen exited repeatedly. Test submitted automatically.');
            setTestCompleted(true);
            setShowResults(true);
          } else {
            addViolation('Exited fullscreen mode');
          }
          return newCount;
        });
        if (!testCompleted) { // Only re-enter if test is not completed
          setTimeout(enterFullscreen, 1000);
        }
      }
    };
    enterFullscreen();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [testStarted, testCompleted]);

  useEffect(() => {
    if (!testStarted) return;
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      }
      img {
        pointer-events: none !important;
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [testStarted]);

  useEffect(() => {
    if (!testStarted) return;
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addViolation('Copy/Cut attempt detected');
    };
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
    };
  }, [testStarted]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();
    const user = accounts.find(acc => acc.email.toLowerCase() === email && acc.password === password);
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setAuthError('');
      if (user.role === 'admin') {
        setShowAdminPanel(true);
      }
    } else {
      setAuthError('Invalid email or password');
      setPasswordInput('');
    }
  };

  const handleAddStudent = () => {
    const email = newStudentEmail.trim().toLowerCase();
    const password = newStudentPassword.trim();
    if (!email || !password) {
      setAdminMessage('Please enter both email and password');
      return;
    }
    if (accounts.some(acc => acc.email.toLowerCase() === email)) {
      setAdminMessage('This email already exists');
      return;
    }
    const newStudent: UserAccount = { email: newStudentEmail.trim(), password, role: 'student' };
    setAccounts([...accounts, newStudent]);
    setNewStudentEmail('');
    setNewStudentPassword('');
    setAdminMessage(`Student ${email} added successfully!`);
    setTimeout(() => setAdminMessage(''), 3000);
  };

  const handleDeleteStudent = (email: string) => {
    if (window.confirm(`Are you sure you want to delete ${email}?`)) {
      setAccounts(accounts.filter(acc => acc.email !== email));
      setAdminMessage(`Student ${email} deleted successfully!`);
      setTimeout(() => setAdminMessage(''), 3000);
    }
  };

  const handleAddTest = () => {
    if (!newTestName.trim()) {
      setAdminMessage('Please enter test name');
      return;
    }
    const duration = parseInt(newTestDuration) * 60;
    if (isNaN(duration) || duration <= 0) {
        setAdminMessage('Please enter a valid duration');
        return;
    }
    // For manual slice tests, you might need a different input for start/end indices
    // For now, adding a test with the full question pool for demonstration
    const newTest: Test = {
      id: 'test' + Date.now(),
      name: newTestName.trim(),
      description: newTestDesc.trim() || 'No description',
      duration: duration,
      questions: sampleQuestions // This will use the full pool unless modified
    };
    setTests([...tests, newTest]);
    setNewTestName('');
    setNewTestDesc('');
    setNewTestDuration('10');
    setAdminMessage(`Test "${newTest.name}" added successfully!`);
    setTimeout(() => setAdminMessage(''), 3000);
  };

  const handleDeleteTest = (testId: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      setTests(tests.filter(t => t.id !== testId));
      setAdminMessage('Test deleted successfully!');
      setTimeout(() => setAdminMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowAdminPanel(false);
    setTestStarted(false);
    setSelectedTest(null);
    setEmailInput('');
    setPasswordInput('');
    setViolations([]);
    setTabSwitchCount(0);
    setFullscreenExitCount(0); // Reset fullscreen exit count on logout
  };

  const handleSelectTest = (test: Test) => {
    setSelectedTest(test);
    setTimeLeft(test.duration);
  };

  const handleStartTest = () => {
    if (selectedTest && selectedTest.questions && selectedTest.questions.length > 0) {
      try {
        // Shuffle options for the selected questions
        const shuffled = selectedTest.questions.map(q => shuffleOptions(q));
        setQuestions(shuffled);
        setTestStarted(true);
        setCurrentQuestion(0);
        setAnswers({});
        setMarkedForReview({});
        setVisitedQuestions(new Set([0]));
        setTimeLeft(selectedTest.duration);
        setTestCompleted(false);
        setShowResults(false);
        setViolations([]);
        setTabSwitchCount(0);
        setFullscreenExitCount(0); // Reset on new test start
      } catch (error) {
        console.error("Error starting test:", error);
        alert("Error starting test. Please try again.");
      }
    } else {
      alert("No questions available for this test. Please contact administrator.");
    }
  };

  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTestCompleted(true);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const clearResponse = () => {
    const qId = questions[currentQuestion]?.id;
    if (qId !== undefined) {
        setAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[qId];
        return newAnswers;
      });
    }
  };

  // ✅ **FIXED: Clarified status counts logic**
  const getStatusCounts = () => {
    let answered = 0;
    let visitedNotAnswered = 0; // Renamed from 'notAnswered' for clarity
    let notVisited = 0;
    let markedForReviewCount = 0;
    let answeredMarked = 0;
    questions.forEach((q, idx) => {
      const isAnswered = answers[q.id] !== undefined;
      const isMarked = markedForReview[q.id];
      const isVisited = visitedQuestions.has(idx);
      if (isAnswered && isMarked) {
        answeredMarked++;
      } else if (isAnswered) {
        answered++;
      } else if (isMarked) {
        markedForReviewCount++;
      } else if (isVisited) { // Visited but not answered
        visitedNotAnswered++; // This was previously called 'notAnswered'
      } else { // Not visited
        notVisited++;
      }
    });
    return { answered, visitedNotAnswered, notVisited, markedForReviewCount, answeredMarked };
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    questions.forEach(q => {
      if (answers[q.id] !== undefined) {
        if (answers[q.id] === q.correctIndex) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        unattempted++;
      }
    });
    const totalMarks = (correct * 4) - (incorrect * 1);
    const maxMarks = questions.length;
    return { correct, incorrect, unattempted, totalMarks, maxMarks };
  };

  const handleSaveAndNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setVisitedQuestions(prev => new Set(prev).add(nextQuestion));
    }
  };

  const handleMarkAndNext = () => {
    const qId = questions[currentQuestion]?.id;
    if (qId !== undefined) {
        setMarkedForReview(prev => ({ ...prev, [qId]: true }));
        if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setVisitedQuestions(prev => new Set(prev).add(nextQuestion));
      }
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const unansweredCount = questions.length - Object.keys(answers).length;
    let confirmMessage = 'Are you sure you want to submit the test?';
    if (unansweredCount > 0) {
      confirmMessage = `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`;
    }
    const confirmed = window.confirm(confirmMessage);
    if (confirmed) {
      setTestCompleted(true);
      setShowResults(true);
    }
  };

  const restartTest = () => {
    setTestStarted(false);
    setSelectedTest(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions(new Set([0]));
    setTimeLeft(DEFAULT_TEST_DURATION);
    setTestCompleted(false);
    setShowResults(false);
    setViolations([]);
    setTabSwitchCount(0);
    setFullscreenExitCount(0); // Reset on restart
  };

  const handleQuestionNavigation = (idx: number) => {
    setCurrentQuestion(idx);
    setVisitedQuestions(prev => new Set(prev).add(idx));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="text-blue-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">JEE B.Arch</h1>
            </div>
            <p className="text-gray-600">Mock Test Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter your password"
                required
              />
            </div>
            {authError && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showAdminPanel && currentUser?.role === 'admin') {
    const students = accounts.filter(acc => acc.role === 'student');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                <p className="text-gray-600">Manage Students & Tests</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
            {adminMessage && (
              <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {adminMessage}
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <UserPlus size={24} />
                  Add New Student
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Email
                    </label>
                    <input
                      type="email"
                      value={newStudentEmail}
                      onChange={(e) => setNewStudentEmail(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="student@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="text"
                      value={newStudentPassword}
                      onChange={(e) => setNewStudentPassword(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Set password"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddStudent}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Add Student
                </button>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <Plus size={24} />
                  Add New Test
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Name
                    </label>
                    <input
                      type="text"
                      value={newTestName}
                      onChange={(e) => setNewTestName(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="e.g., Mock Test 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newTestDesc}
                      onChange={(e) => setNewTestDesc(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="Brief description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={newTestDuration}
                      onChange={(e) => setNewTestDuration(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      placeholder="10"
                      min="1"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddTest}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Add Test
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Registered Students ({students.length})
                </h2>
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No students registered yet</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {students.map((student, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{student.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteStudent(student.email)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Available Tests ({tests.length})
                </h2>
                {tests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tests available</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {tests.map((test) => (
                      <div key={test.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen size={18} className="text-green-600" />
                              <h3 className="font-semibold text-gray-800">{test.name}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{test.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>⏱️ {Math.floor(test.duration / 60)} min</span>
                              <span>📝 {test.questions.length} questions</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTest(test.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-sm transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedTest && !testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Available Mock Tests</h1>
                <p className="text-gray-600">Select a test to begin</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-600">Logged in as:</div>
                    <div className="text-sm font-semibold text-gray-800">{currentUser?.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
            {tests.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">No tests available at the moment</p>
                <p className="text-sm text-gray-400 mt-2">Please check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-6 hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
                    onClick={() => handleSelectTest(test)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <BookOpen size={24} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 flex-1">{test.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-4 min-h-[48px]">{test.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={18} className="text-blue-600" />
                        <span className="text-sm font-medium">Duration: {Math.floor(test.duration / 60)} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <BookOpen size={18} className="text-blue-600" />
                        <span className="text-sm font-medium">Questions: {test.questions.length}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTest(test);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
                    >
                      Select Test
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selectedTest && !testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedTest(null)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition text-sm"
              >
                ← Back to Tests
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-600">Logged in as:</div>
                  <div className="text-sm font-semibold text-gray-800">{currentUser?.email}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen size={32} className="text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">{selectedTest.name}</h1>
            </div>
            <p className="text-gray-600 mb-6">{selectedTest.description}</p>
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="text-red-600" size={32} />
                <h2 className="text-xl font-semibold text-red-900">Security Notice</h2>
              </div>
              <ul className="text-left text-red-800 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Test will run in fullscreen mode
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Screenshots, screen recording, and printing are disabled
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  Tab switching and window switching will be monitored
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  All security violations will be logged
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Test Instructions</h2>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Total Questions: {selectedTest.questions.length}
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Time Duration: {Math.floor(selectedTest.duration / 60)} minutes
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Each question carries 4 marks
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Negative marking: -1 for incorrect answers
                </li>
              </ul>
            </div>
            <button
              onClick={handleStartTest}
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition transform hover:scale-105"
            >
              I Agree - Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const { correct, incorrect, unattempted, totalMarks, maxMarks } = calculateScore();
    const percentage = ((totalMarks / maxMarks) * 100).toFixed(2);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Test Results</h1>
              <p className="text-gray-600">{selectedTest?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <User size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600">{currentUser?.email}</span>
            </div>
          </div>
          {violations.length > 0 && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="text-red-600" size={24} />
                <h3 className="text-lg font-semibold text-red-900">Security Violations Detected: {violations.length}</h3>
              </div>
              <div className="text-sm text-red-800 max-h-32 overflow-y-auto space-y-1">
                {violations.map((v, idx) => (
                  <div key={idx} className="py-1 border-b border-red-200 last:border-0">• {v}</div>
                ))}
              </div>
            </div>
          )}
          {tabSwitchCount > 0 && (
            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-6">
              <p className="text-orange-800 font-semibold">
                ⚠️ Tab Switches / Focus Loss: {tabSwitchCount} times
              </p>
            </div>
          )}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-8 mb-8 text-white">
            <h2 className="text-2xl font-semibold mb-6 text-center">Your Score</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold">{correct}</div>
                <div className="text-sm mt-1">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{incorrect}</div>
                <div className="text-sm mt-1">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{unattempted}</div>
                <div className="text-sm mt-1">Unattempted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{questions.length}</div>
                <div className="text-sm mt-1">Total</div>
              </div>
            </div>
            <div className="border-t-2 border-white/30 pt-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{totalMarks} / {maxMarks}</div>
                <div className="text-xl">Marks Obtained ({percentage}%)</div>
                <div className="text-sm mt-3 opacity-90">
                  Marking Scheme: +4 for correct, -1 for incorrect
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4 mb-8">
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctIndex;
              const isAttempted = userAnswer !== undefined;
              return (
                <div key={q.id} className={`border-2 rounded-lg p-4 ${isCorrect ? 'border-green-300 bg-green-50' : isAttempted ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 flex-1">
                      Q{idx + 1}. {q.question}
                      {q.type === 'match-pair' && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Match the Pair</span>}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="text-green-600" size={24} />
                          <span className="text-green-600 font-bold text-sm">+4</span>
                        </>
                      ) : isAttempted ? (
                        <>
                          <XCircle className="text-red-600" size={24} />
                          <span className="text-red-600 font-bold text-sm">-1</span>
                        </>
                      ) : (
                        <span className="text-gray-500 text-sm font-semibold">Not Answered (0)</span>
                      )}
                    </div>
                  </div>
                  {q.type === 'match-pair' && q.columnAItems && (
                    <div className="mb-3 bg-white p-3 rounded border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-sm font-medium text-blue-700 mb-2">Column A:</div>
                          <div className="space-y-1 text-sm text-gray-600">
                            {q.columnAItems.map((item, i) => (
                              <div key={i} className="flex gap-2">
                                <span className="font-semibold">{i + 1}.</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {q.columnBItems && (
                          <div>
                            <div className="text-sm font-medium text-purple-700 mb-2">Column B:</div>
                            <div className="space-y-1 text-sm text-gray-600">
                              {q.columnBItems.map((item, i) => (
                                <div key={i}>{item}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {q.image && (
                    <div className="mb-3">
                      <img
                        src={q.image}
                        alt="Question"
                        className="max-w-xs h-auto border border-gray-300 rounded"
                      />
                    </div>
                  )}
                  <div className="ml-4 space-y-1">
                    {isAttempted && !isCorrect && (
                      <p className="text-red-600 text-sm">Your answer: <span className="font-semibold">{String.fromCharCode(65 + userAnswer)} - {q.shuffledOptions[userAnswer].text}</span></p>
                    )}
                    <p className="text-green-600 text-sm font-semibold">Correct answer: <span className="font-semibold">{String.fromCharCode(65 + q.correctIndex)} - {q.shuffledOptions[q.correctIndex].text}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center flex gap-4 justify-center">
            <button
              onClick={restartTest}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition"
            >
              <RotateCcw size={20} />
              Take Another Test
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg inline-flex items-center gap-2 transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || testCompleted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading questions...</div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  if (!q) {
      return <div className="min-h-screen bg-white flex items-center justify-center">Invalid question index.</div>;
  }
  const statusCounts = getStatusCounts();
  return (
    <div ref={containerRef} className="min-h-screen bg-white relative">
      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-pulse">
          <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <AlertTriangle size={24} />
            <span className="font-bold">{warningMessage}</span>
          </div>
        </div>
      )}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-full px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white px-4 py-2 rounded">
              <span className="text-sm font-semibold">{selectedTest?.name}</span>
            </div>
            {!isFullscreen && (
              <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={16} />
                Not in fullscreen
              </div>
            )}
          </div>
          <div className="text-right flex items-center gap-4">
            {violations.length > 0 && (
              <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm font-semibold flex items-center gap-2">
                <AlertTriangle size={16} />
                Violations: {violations.length}
              </div>
            )}
            <div className="text-lg font-bold text-gray-800">Time Left: {formatTime(timeLeft)}</div>
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-70px)]">
        <div className="flex-1 overflow-auto">
          <div className="bg-blue-500 text-white px-6 py-3 font-semibold flex items-center justify-between">
            <span>Question No. {currentQuestion + 1}</span>
            {q.type === 'match-pair' && (
              <span className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full font-bold">Match the Pair</span>
            )}
          </div>
          <div className="p-6 pb-24">
            <h3 className="text-lg font-medium text-gray-800 mb-6">{q.question}</h3>
            {q.type === 'match-pair' && q.columnAItems && (
              <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-lg border-2 border-blue-300 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-blue-900 mb-3 text-base flex items-center gap-2">
                      <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">A</span>
                      Column A (Items to Match):
                    </h4>
                    <div className="space-y-2">
                      {q.columnAItems.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-white p-3 rounded shadow-sm border-l-4 border-blue-500">
                          <span className="font-bold text-blue-600 text-lg min-w-[24px]">{idx + 1}.</span>
                          <span className="text-gray-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {q.columnBItems && (
                    <div>
                      <h4 className="font-bold text-purple-900 mb-3 text-base flex items-center gap-2">
                        <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">B</span>
                        Column B (Match with):
                      </h4>
                      <div className="space-y-2">
                        {q.columnBItems.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start bg-white p-3 rounded shadow-sm border-l-4 border-purple-500">
                            <span className="text-gray-800">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t-2 border-blue-200">
                  <p className="text-sm font-semibold text-gray-700 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                    📋 Select the correct matching combination from the options below (Format: 1-A, 2-B, 3-C, 4-D)
                  </p>
                </div>
              </div>
            )}
            {q.image && (
              <div className="mb-6 flex justify-center relative">
                <img
                  src={q.image}
                  alt="Question visual"
                  className="max-w-full h-auto max-h-96 object-contain border-2 border-gray-300 rounded-lg shadow-md"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
              </div>
            )}
            <div className="space-y-3">
              {q.shuffledOptions.map((option, idx) => (
                <label
                  key={idx}
                  className="flex items-start cursor-pointer group"
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={answers[q.id] === idx}
                    onChange={() => handleAnswer(q.id, idx)}
                    className="mt-1 w-4 h-4"
                  />
                  <span className="ml-3 text-base text-gray-700">
                    <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="fixed bottom-0 left-0 bg-white border-t-2 border-gray-200 p-4 z-50" style={{ right: '320px' }}>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                type="button"
                onClick={handleMarkAndNext}
                className="px-6 py-2 bg-white border-2 border-gray-400 text-gray-700 rounded hover:bg-gray-50 font-medium cursor-pointer"
              >
                Mark for Review & Next
              </button>
              <button
                type="button"
                onClick={clearResponse}
                className="px-6 py-2 bg-white border-2 border-gray-400 text-gray-700 rounded hover:bg-gray-50 font-medium cursor-pointer"
              >
                Clear Response
              </button>
              <div className="flex-1"></div>
              <button
                type="button"
                onClick={handleSaveAndNext}
                className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium cursor-pointer"
              >
                Save & Next
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 font-medium cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="w-80 bg-gray-50 border-l-2 border-gray-200 overflow-auto">
          <div className="bg-white border-b-2 border-gray-200 p-4 flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
              <User size={32} className="text-gray-600" />
            </div>
            <div>
              <div className="text-blue-600 font-medium">Profile</div>
              <div className="text-xs text-gray-600 truncate max-w-[180px]" title={currentUser?.email}>{currentUser?.email}</div>
            </div>
          </div>
          {violations.length > 0 && (
            <div className="bg-red-50 border-b-2 border-red-200 p-3">
              <div className="flex items-center gap-2 text-red-700 text-xs font-semibold mb-2">
                <Shield size={16} />
                Security Alerts: {violations.length}
              </div>
              <div className="text-xs text-red-600 max-h-20 overflow-y-auto">
                {violations.slice(-3).map((v, idx) => (
                  <div key={idx} className="py-1">• {v}</div>
                ))}
              </div>
            </div>
          )}
          <div className="p-4 bg-white border-b-2 border-gray-200">
            {/* ✅ **FIXED: Updated labels to reflect the corrected logic** */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {statusCounts.answered}
                </div>
                <span className="text-xs font-medium text-gray-700">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {statusCounts.visitedNotAnswered} {/* Renamed variable */}
                </div>
                <span className="text-xs font-medium text-gray-700">Visited, Not Answered</span> {/* Updated label */}
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {statusCounts.notVisited}
                </div>
                <span className="text-xs font-medium text-gray-700">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {statusCounts.markedForReviewCount}
                </div>
                <span className="text-xs font-medium text-gray-700">Marked for Review</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-green-500">
                {statusCounts.answeredMarked}
              </div>
              <span className="text-xs text-gray-700">Answered & Marked for Review</span>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-blue-600 text-white text-center py-2 mb-3 font-semibold text-sm">
              {selectedTest?.name}
            </div>
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Choose a Question</h4>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((_, idx) => {
                const qId = questions[idx].id;
                const isAnswered = answers[qId] !== undefined;
                const isMarked = markedForReview[qId];
                const isCurrent = idx === currentQuestion;
                const isVisited = visitedQuestions.has(idx);
                let bgColor = 'bg-gray-300 text-gray-700';
                let borderClass = '';
                if (isCurrent) {
                  bgColor = 'bg-orange-500 text-white shadow-lg';
                } else if (isAnswered && isMarked) {
                  bgColor = 'bg-purple-600 text-white';
                  borderClass = 'ring-4 ring-green-500';
                } else if (isAnswered) {
                  bgColor = 'bg-green-500 text-white';
                } else if (isMarked) {
                  bgColor = 'bg-purple-600 text-white';
                } else if (isVisited) { // Visited but not answered
                  bgColor = 'bg-red-500 text-white';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuestionNavigation(idx)}
                    className={`w-12 h-12 rounded-lg font-bold text-sm ${bgColor} ${borderClass} hover:opacity-80 transition`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
