import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  LogIn, 
  UserCircle, 
  LogOut, 
  Shield, 
  Clock, 
  Zap, 
  Users, 
  Lock, 
  Trash2, 
  QrCode, 
  MessageSquare, 
  Timer,
  CheckCircle,
  Moon,
  Sun
} from 'lucide-react';

export default function LandingPage() {
  const [roomCode, setRoomCode] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  // डार्क मोड को कंपोनेंट माउंट पर इनिशियलाइज़ करें
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') !== 'false';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/join/${roomCode.toUpperCase()}`);
    }
  };

  const handleCreateRoom = () => {
    navigate('/admin/create-room');
  };

  const handleAdminDashboard = () => {
    navigate('/admin');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'पूर्ण गुमनामी',
      description: 'साइन अप की आवश्यकता नहीं। रैंडम अवतार के साथ तुरंत जुड़ें। आपकी पहचान छिपी रहती है।'
    },
    {
      icon: Clock,
      title: 'समय-सीमित सत्र',
      description: 'रूम स्वचालित रूप से समाप्त हो जाते हैं। टाइमर शून्य होने पर सभी संदेश स्वयं नष्ट हो जाते हैं।'
    },
    {
      icon: Trash2,
      title: 'शून्य डिजिटल फुटप्रिंट',
      description: 'कोई चैट इतिहास नहीं। कोई डेटा रिटेंशन नहीं। डिज़ाइन द्वारा पूर्ण गोपनीयता की गारंटी।'
    },
    {
      icon: Zap,
      title: 'रियल-टाइम मैसेजिंग',
      description: 'WebSocket तकनीक के साथ तत्काल संदेश वितरण। चैट स्वाभाविक रूप से प्रवाहित होती है।'
    },
    {
      icon: QrCode,
      title: 'आसान पहुंच',
      description: 'QR कोड या सरल रूम कोड साझा करें। सेकंड में किसी भी डिवाइस से जुड़ें।'
    },
    {
      icon: Lock,
      title: 'सुरक्षित और निजी',
      description: 'एंड-टू-एंड एन्क्रिप्शन। रो-लेवल सुरक्षा। आपकी बातचीत निजी रहती है।'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'बनाएं या जुड़ें',
      description: 'एडमिन कस्टम सेटिंग्स के साथ रूम बनाता है। यूजर्स सरल कोड या QR स्कैन से जुड़ते हैं।',
      icon: Users
    },
    {
      step: '2',
      title: 'गुमनाम अवतार प्राप्त करें',
      description: 'स्वचालित रूप से "Ghost-42" या "Ninja-15" जैसा रैंडम अवतार असाइन किया जाता है। कोई व्यक्तिगत जानकारी की आवश्यकता नहीं।',
      icon: UserCircle
    },
    {
      step: '3',
      title: 'स्वतंत्र रूप से चैट करें',
      description: 'गुमनाम रूप से विचार साझा करें। पूर्ण गोपनीयता सुरक्षा के साथ रियल-टाइम मैसेजिंग।',
      icon: MessageSquare
    },
    {
      step: '4',
      title: 'टाइमर समाप्त',
      description: 'जब समय समाप्त हो जाता है, तो सभी संदेश और रूम डेटा स्थायी रूप से हटा दिए जाते हैं। शून्य निशान।',
      icon: Timer
    }
  ];

  const pricingPlans = [
    {
      name: 'फ्री टियर',
      price: '₹0',
      duration: '10 मिनट',
      features: [
        'गुमनाम चैट एक्सेस',
        'रैंडम अवतार असाइनमेंट',
        'रियल-टाइम मैसेजिंग',
        'समाप्ति पर ऑटो-डिलीट',
        'QR कोड एक्सेस'
      ],
      popular: false
    },
    {
      name: 'क्विक एक्सटेंड',
      price: '₹10',
      duration: '+5 मिनट',
      features: [
        'सभी फ्री फीचर्स',
        'सक्रिय सत्र बढ़ाएं',
        'बातचीत जारी रखें',
        'तत्काल सक्रियण',
        'सुरक्षित भुगतान'
      ],
      popular: false
    },
    {
      name: 'स्टैंडर्ड',
      price: '₹29',
      duration: '+15 मिनट',
      features: [
        'सभी फ्री फीचर्स',
        'विस्तारित चैट समय',
        'बेहतर वैल्यू',
        'मल्टिपल एक्सटेंशन',
        'प्राथमिकता सपोर्ट'
      ],
      popular: true
    },
    {
      name: 'प्रीमियम',
      price: '₹99',
      duration: '+1 घंटा',
      features: [
        'सभी फ्री फीचर्स',
        'अधिकतम चैट समय',
        'प्रति मिनट सर्वोत्तम मूल्य',
        'गहरी बातचीत',
        'VIP अनुभव'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">Secret Room</h1>
            </div>
            <nav className="hidden xl:flex items-center gap-6">
              <a href="#features" className="text-sm hover:text-primary transition-colors">फीचर्स</a>
              <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">कैसे काम करता है</a>
              <a href="#pricing" className="text-sm hover:text-primary transition-colors">प्राइसिंग</a>
              <a href="#join" className="text-sm hover:text-primary transition-colors">अभी जुड़ें</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="w-9 h-9 p-0"
                title={darkMode ? 'लाइट मोड' : 'डार्क मोड'}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              {profile ? (
                <>
                  <span className="text-sm text-muted-foreground hidden xl:flex items-center gap-1">
                    <UserCircle className="w-4 h-4" />
                    {profile.username}
                  </span>
                  {profile.role === 'admin' && (
                    <Button variant="outline" size="sm" onClick={handleAdminDashboard}>
                      डैशबोर्ड
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4 xl:mr-2" />
                    <span className="hidden xl:inline">लॉगआउट</span>
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  <LogIn className="w-4 h-4 xl:mr-2" />
                  <span className="hidden xl:inline">एडमिन लॉगिन</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 xl:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="text-sm px-4 py-1">
              🎭 एफेमेरल एनोनिमस चैट प्लेटफॉर्म
            </Badge>
            <h2 className="text-4xl xl:text-7xl font-bold gradient-text neon-glow leading-tight">
              राज साझा करें।<br />कोई निशान न छोड़ें।
            </h2>
            <p className="text-lg xl:text-2xl text-muted-foreground max-w-3xl mx-auto">
              समय-सीमित गुमनाम चैट रूम जहां बातचीत शून्य में गायब हो जाती है। 
              कोई साइन अप नहीं। कोई इतिहास नहीं। पूर्ण गोपनीयता।
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}>
                <Sparkles className="w-5 h-5 mr-2" />
                अभी रूम में जुड़ें
              </Button>
              {profile?.role === 'admin' && (
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={handleCreateRoom}>
                  रूम बनाएं
                </Button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>साइन अप की आवश्यकता नहीं</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>100% गुमनाम</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>ऑटो-डिलीट संदेश</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 xl:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-sm px-4 py-1">फीचर्स</Badge>
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              गोपनीयता और गुमनामी के लिए बनाया गया
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              हर फीचर एक लक्ष्य के साथ डिज़ाइन किया गया: आपकी पहचान की रक्षा करें और शून्य डिजिटल फुटप्रिंट सुनिश्चित करें।
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 xl:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-sm px-4 py-1">कैसे काम करता है</Badge>
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              सरल। तेज़। गुमनाम।
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              पूर्ण गुमनामी के लिए चार चरण। कोई जटिल सेटअप नहीं। बस शुद्ध, निजी बातचीत।
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <Card className="glass-card h-full">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <Badge className="mb-2">चरण {item.step}</Badge>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{item.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 xl:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-sm px-4 py-1">प्राइसिंग</Badge>
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              केवल तभी भुगतान करें जब आपको अधिक समय चाहिए
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              10 मिनट के साथ मुफ्त शुरू करें। लचीले प्राइसिंग विकल्पों के साथ कभी भी बढ़ाएं।
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`glass-card relative ${plan.popular ? 'border-primary shadow-lg shadow-primary/20 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">सबसे लोकप्रिय</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="py-4">
                    <div className="text-4xl font-bold text-primary">{plan.price}</div>
                    <div className="text-sm text-muted-foreground mt-1">{plan.duration}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              💳 Stripe द्वारा संचालित सुरक्षित भुगतान • सभी लेनदेन एन्क्रिप्टेड
            </p>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-20 xl:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card border-primary/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl gradient-text">रूम में जुड़ें</CardTitle>
                <CardDescription className="text-base">
                  गुमनाम चैट सत्र में शामिल होने के लिए 6-अक्षर का रूम कोड दर्ज करें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col xl:flex-row gap-3">
                  <Input
                    placeholder="रूम कोड दर्ज करें (जैसे, ABC123)"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                    className="text-lg h-14 text-center font-mono tracking-widest"
                    maxLength={6}
                  />
                  <Button 
                    onClick={handleJoinRoom} 
                    size="lg" 
                    disabled={!roomCode.trim()}
                    className="h-14 px-8"
                  >
                    रूम में जुड़ें
                  </Button>
                </div>
                <Separator />
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">कोड नहीं है?</p>
                  {profile?.role === 'admin' ? (
                    <Button variant="outline" onClick={handleCreateRoom} className="w-full">
                      अपना खुद का रूम बनाएं
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      एडमिन से रूम बनाने और आपके साथ कोड साझा करने के लिए कहें
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              गुमनाम रूप से साझा करने के लिए तैयार हैं?
            </h3>
            <p className="text-lg text-muted-foreground">
              हजारों यूजर्स में शामिल हों जो निजी, एफेमेरल बातचीत के लिए Secret Room पर भरोसा करते हैं।
            </p>
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}>
              <Sparkles className="w-5 h-5 mr-2" />
              मुफ्त में शुरू करें
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <h4 className="font-bold text-lg gradient-text">Secret Room</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                एफेमेरल एनोनिमस चैट प्लेटफॉर्म। राज साझा करें, कोई निशान न छोड़ें।
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">प्रोडक्ट</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">फीचर्स</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">कैसे काम करता है</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">प्राइसिंग</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">सुरक्षा</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>एंड-टू-एंड एन्क्रिप्शन</li>
                <li>शून्य डेटा रिटेंशन</li>
                <li>डिज़ाइन द्वारा गुमनाम</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">कानूनी</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>गोपनीयता नीति</li>
                <li>सेवा की शर्तें</li>
                <li>समुदाय दिशानिर्देश</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col xl:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Secret Room. सभी बातचीत एफेमेरल हैं।</p>
            <div className="flex items-center gap-4">
              <span>गोपनीयता को ध्यान में रखकर बनाया गया</span>
              <span>•</span>
              <span>Supabase और Stripe द्वारा संचालित</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
