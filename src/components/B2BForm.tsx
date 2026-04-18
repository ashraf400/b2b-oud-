import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronLeft, ChevronRight, Send } from 'lucide-react';

type FormData = {
  name: string;
  company: string;
  email: string;
  countryCode: string;
  phone: string;
  businessType: string;
  monthlyVolume: string;
  interests: string[];
};

const countries = [
  { code: '+966', name: 'السعودية', flag: '🇸🇦' },
  { code: '+971', name: 'الإمارات', flag: '🇦🇪' },
  { code: '+965', name: 'الكويت', flag: '🇰🇼' },
  { code: '+974', name: 'قطر', flag: '🇶🇦' },
  { code: '+968', name: 'عمان', flag: '🇴🇲' },
  { code: '+973', name: 'البحرين', flag: '🇧🇭' },
  { code: '+20', name: 'مصر', flag: '🇪🇬' },
  { code: '+962', name: 'الأردن', flag: '🇯🇴' },
];

export default function B2BForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    countryCode: '+966',
    phone: '',
    businessType: '',
    monthlyVolume: '',
    interests: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhone = (phone: string) => {
    // Basic validation for numbers after country code
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return cleanPhone.length >= 8 && cleanPhone.length <= 11;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.name || !formData.company) {
        setError('يرجى إكمال جميع الحقول المطلوبة');
        return;
      }
    }
    if (step === 2) {
      if (!formData.phone) {
        setError('يرجى إدخال رقم الهاتف');
        return;
      }
      if (!validatePhone(formData.phone)) {
        setError('يرجى إدخال رقم هاتف صحيح (مثال: 5XXXXXXXX)');
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Final validation
    if (!validatePhone(formData.phone)) {
      setError('يرجى إدخال رقم هاتف صحيح');
      setStep(2);
      return;
    }

    if (!formData.businessType || !formData.monthlyVolume) {
      setError('يرجى تحديد نوع النشاط وحجم الطلب');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setError('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError('فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof FormData, value: any) => {
    let finalValue = value;
    
    // Auto-convert Eastern Arabic numerals (١٢٣) to Western Arabic (123) for phone
    if (field === 'phone' && typeof value === 'string') {
      finalValue = value.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    }
    
    setFormData((prev) => ({ ...prev, [field]: finalValue }));
  };

  const toggleInterest = (interest: string) => {
    const current = formData.interests;
    if (current.includes(interest)) {
      updateField('interests', current.filter((i) => i !== interest));
    } else {
      updateField('interests', [...current, interest]);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 bg-white rounded-3xl shadow-xl border border-gold/20"
      >
        <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">شكراً لاهتمامك!</h3>
        <p className="text-gray-600 mb-8">لقد تم استلام طلبك بنجاح. سيقوم فريقنا بالتواصل معك خلال 24 ساعة لمناقشة تفاصيل الشراكة.</p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="text-gold font-bold hover:underline"
        >
          إرسال طلب آخر
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold/10">
      <div className="gold-gradient h-2 w-full" />
      
      <form onSubmit={handleSubmit} className="p-8 md:p-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gold uppercase tracking-widest">خطوة {step} من 3</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-gold' : 'bg-gray-200'}`} 
                />
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-luxury-black">طلب عرض سعر بالجملة</h2>
          <p className="text-gray-500 mt-2">يرجى تزويدنا ببعض المعلومات لنتمكن من تقديم أفضل عرض يناسب احتياجاتك.</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold"
            >
              {error}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
                <input
                  required
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  placeholder="أدخل اسمك"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">اسم الشركة / المتجر</label>
                <input
                  required
                  type="text"
                  name="organization"
                  autoComplete="organization"
                  value={formData.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  placeholder="أدخل اسم شركتك"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-luxury-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gold transition-colors"
                >
                  التالي <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-bold mb-2">البريد الإلكتروني</label>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  placeholder="example@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">رقم التواصل (واتساب)</label>
                <div className="flex gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => updateField('countryCode', e.target.value)}
                    className="w-32 p-4 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all bg-white font-bold text-sm"
                    dir="ltr"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    type="tel"
                    name="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="flex-1 p-4 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-left"
                    dir="ltr"
                    placeholder="5X XXX XXXX"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-gray-500 font-bold flex items-center gap-2 hover:text-luxury-black transition-colors"
                >
                  <ChevronRight className="w-5 h-5" /> السابق
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-luxury-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gold transition-colors"
                >
                  التالي <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-bold mb-4">نوع النشاط التجاري</label>
                <div className="grid grid-cols-2 gap-3">
                  {['متجر إلكتروني', 'محل تجزئة', 'عميل عادي', 'موزع جملة'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateField('businessType', type)}
                      className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                        formData.businessType === type 
                        ? 'border-gold bg-gold/5 text-gold' 
                        : 'border-gray-200 hover:border-gold/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-4">حجم الطلب الشهري المتوقع</label>
                <select
                  value={formData.monthlyVolume}
                  onChange={(e) => updateField('monthlyVolume', e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-gold outline-none bg-white font-bold"
                >
                  <option value="">اختر الحجم...</option>
                  <option value="أقل من 5 كجم (خشب) / 10 تولات (دهن)">أقل من 5 كجم (خشب) / 10 تولات (دهن)</option>
                  <option value="5 - 20 كجم (خشب) / 10 - 50 تولة (دهن)">5 - 20 كجم (خشب) / 10 - 50 تولة (دهن)</option>
                  <option value="20 - 50 كجم (خشب) / 50 - 100 تولة (دهن)">20 - 50 كجم (خشب) / 50 - 100 تولة (دهن)</option>
                  <option value="أكثر من 50 كجم (خشب) / أكثر من 100 تولة (دهن)">أكثر من 50 كجم (خشب) / أكثر من 100 تولة (دهن)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-4">المنتجات المهتم بها</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'عود طبيعي', outOfStock: true },
                    { name: 'عود محسن', outOfStock: true },
                    { name: 'دهن عود', outOfStock: false },
                    { name: 'مباخر هدايا', outOfStock: false }
                  ].map((product) => (
                    <button
                      key={product.name}
                      type="button"
                      disabled={product.outOfStock}
                      onClick={() => toggleInterest(product.name)}
                      className={`px-4 py-2 rounded-full border text-xs font-bold transition-all relative ${
                        product.outOfStock
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : formData.interests.includes(product.name)
                        ? 'border-gold bg-gold text-white'
                        : 'border-gray-200 hover:border-gold/50'
                      }`}
                    >
                      {product.name}
                      {product.outOfStock && (
                        <span className="block text-[8px] text-red-500 mt-0.5">نفذت الكمية</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-gray-500 font-bold flex items-center gap-2 hover:text-luxury-black transition-colors"
                >
                  <ChevronRight className="w-5 h-5" /> السابق
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-gold text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-gold/20 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gold-dark'
                  }`}
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'} <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
