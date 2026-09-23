import { ChecklistItem, HospitalBagItem } from '@/types/pregnancy';

export const DEFAULT_CHECKLISTS: ChecklistItem[] = [
  // First Trimester
  {
    id: 'c-1',
    category: 'first-trimester',
    titleEn: 'Schedule your first prenatal consultation & confirmation scan',
    titleBn: 'প্রথম প্রসবপূর্ব ডাক্তার ভিজিট ও কনফার্মেশন স্ক্যানের সময় নিন',
    isCompleted: false,
  },
  {
    id: 'c-2',
    category: 'first-trimester',
    titleEn: 'Start taking prenatal vitamins with folic acid daily',
    titleBn: 'ডাক্তারের পরামর্শে ফলিক এসিডযুক্ত প্রসবপূর্ব ভিটামিন খাওয়া শুরু করুন',
    isCompleted: false,
  },
  {
    id: 'c-3',
    category: 'first-trimester',
    titleEn: 'Review medications & dietary supplements with doctor',
    titleBn: 'চলতি সমস্ত ওষুধ ও খাদ্যতালিকাগত সম্পূরক ডাক্তারকে দেখিয়ে নিন',
    isCompleted: false,
  },
  {
    id: 'c-4',
    category: 'first-trimester',
    titleEn: 'Eliminate harmful substances (smoking, alcohol, raw meat)',
    titleBn: 'ক্ষতিকর বিষয় (ধূমপান, ক্যাফেইন, অর্ধসিদ্ধ খাবার) সম্পূর্ণরূপে পরিহার করুন',
    isCompleted: false,
  },

  // Second Trimester
  {
    id: 'c-5',
    category: 'second-trimester',
    titleEn: 'Complete 18-22 week anatomical / anomaly ultrasound scan',
    titleBn: '১৮-২২ সপ্তাহের বিস্তারিত অ্যানোমালি আল্ট্রাসাউন্ড টেস্ট করান',
    isCompleted: false,
  },
  {
    id: 'c-6',
    category: 'second-trimester',
    titleEn: 'Undergo routine oral glucose tolerance test (screening for GD)',
    titleBn: 'জেস্টেশনাল ডায়াবেটিসের জন্য ওজিটিটি (OGTT) রক্ত পরীক্ষা করান',
    isCompleted: false,
  },
  {
    id: 'c-7',
    category: 'second-trimester',
    titleEn: 'Begin gentle pelvic floor & Kegel exercise routines',
    titleBn: 'নিয়মিত পেলভিক ফ্লোর ও কিগেল ব্যায়ামের অভ্যাস গড়ে তুলুন',
    isCompleted: false,
  },
  {
    id: 'c-8',
    category: 'second-trimester',
    titleEn: 'Research childbirth classes or breastfeeding basics',
    titleBn: 'প্রসব প্রস্তুতি ও মাতৃদুগ্ধ পান করানো বিষয়ক তথ্য জানুন',
    isCompleted: false,
  },

  // Third Trimester
  {
    id: 'c-9',
    category: 'third-trimester',
    titleEn: 'Monitor daily baby kick patterns & movements',
    titleBn: 'প্রতিদিন নির্দিষ্ট সময়ে বাচ্চার নড়াচড়ার ছন্দ ও লাথি পর্যবেক্ষণ করুন',
    isCompleted: false,
  },
  {
    id: 'c-10',
    category: 'third-trimester',
    titleEn: 'Pack and verify the hospital bag checklist',
    titleBn: 'হাসপাতালে নেওয়ার ব্যাগ প্রস্তুত করুন এবং প্রয়োজনীয় সামগ্রী গুছিয়ে রাখুন',
    isCompleted: false,
  },
  {
    id: 'c-11',
    category: 'third-trimester',
    titleEn: 'Finalize birth plan preferences & emergency transport contact',
    titleBn: 'প্রসবকালীন পরিকল্পনা এবং জরুরি যাতায়াতের সার্বক্ষণিক ব্যবস্থা নিশ্চিত করুন',
    isCompleted: false,
  },
  {
    id: 'c-12',
    category: 'third-trimester',
    titleEn: 'Install infant car seat or prepare safe transport home',
    titleBn: 'হাসপাতাল থেকে নবজাতককে নিরাপদভাবে বাড়ি আনার ব্যবস্থা প্রস্তুত রাখুন',
    isCompleted: false,
  },
];

export const DEFAULT_HOSPITAL_BAG: HospitalBagItem[] = [
  // Mother
  { id: 'hb-1', category: 'mother', titleEn: 'Comfortable nightgowns / nursing front-open shirts (2-3 sets)', titleBn: 'সামনে বোতামযুক্ত ঢিলেঢালা সুতির পোশাক (২-৩ জোড়া)', isPacked: false },
  { id: 'hb-2', category: 'mother', titleEn: 'Maternity sanitary pads & disposable underwear', titleBn: 'ম্যাটারনিটি স্যানিটারি প্যাড ও ডিসপোজেবল অন্তর্বাস', isPacked: false },
  { id: 'hb-3', category: 'mother', titleEn: 'Nursing bras and breast pads', titleBn: 'সুতির নার্সিং ব্রা এবং ব্রেস্ট প্যাড', isPacked: false },
  { id: 'hb-4', category: 'mother', titleEn: 'Warm non-slip slippers and cozy socks', titleBn: 'নরম চটি জুতো এবং আরামদায়ক সুতির মোজা', isPacked: false },
  { id: 'hb-5', category: 'mother', titleEn: 'Toiletries: toothbrush, soap, lip balm, hair ties', titleBn: 'টুথব্রাশ, পেস্ট, মৃদু সাবান, চিরুনি ও লিপবাম', isPacked: false },

  // Baby
  { id: 'hb-6', category: 'baby', titleEn: 'Soft cotton onesies/sleepsuits (3-4 sets)', titleBn: 'নরম সুতির বেবি সুট বা কাঁথা/পোশাক (৩-৪ সেট)', isPacked: false },
  { id: 'hb-7', category: 'baby', titleEn: 'Newborn diapers and alcohol-free gentle wet wipes', titleBn: 'নবজাতকের ডায়াপার ও অ্যালকোহলমুক্ত বেবি ওয়াইপস', isPacked: false },
  { id: 'hb-8', category: 'baby', titleEn: 'Baby caps, mittens, and warm socks', titleBn: 'বাচ্চার নরম সুতির টুপি, হাতমোজা ও মোজা', isPacked: false },
  { id: 'hb-9', category: 'baby', titleEn: 'Soft swaddle blankets / cotton wraps (2-3)', titleBn: 'নরম সুতির মোড়ানোর কাপড় বা বেবি ব্ল্যাঙ্কেট', isPacked: false },

  // Documents & Personal
  { id: 'hb-10', category: 'documents', titleEn: 'Antenatal care card, ultrasound reports & blood test files', titleBn: 'প্রেগন্যান্সির ফাইল, আল্ট্রাসাউন্ড ও রক্ত পরীক্ষার সমস্ত রিপোর্ট', isPacked: false },
  { id: 'hb-11', category: 'documents', titleEn: 'National ID / Hospital insurance documents', titleBn: 'জাতীয় পরিচয়পত্র / হাসপাতাল রেজিস্ট্রেশন কার্ড', isPacked: false },
  { id: 'hb-12', category: 'personal', titleEn: 'Long-cord phone charger & power bank', titleBn: 'মোবাইল চার্জার এবং পাওয়ার ব্যাংক', isPacked: false },
  { id: 'hb-13', category: 'personal', titleEn: 'Water bottle and light healthy snacks for partner', titleBn: 'পানির বোতল ও সাথে থাকা স্বজনের জন্য শুকনো খাবার', isPacked: false },
];
