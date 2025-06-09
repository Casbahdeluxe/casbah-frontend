import React, { useState, useEffect } from 'react';
import { Mail, KeyRound, User, Phone, Briefcase, FileText, Upload, Car, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Votre URL personnelle a été intégrée ici.
const API_URL = 'https://casbah-backend.onrender.com';


// --- Composant Alerte ---
const Alert = ({ message, type, onClose }) => {
  if (!message) return null;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const styles = {
    success: { bg: 'bg-green-50/80', border: 'border-green-400', text: 'text-green-800' },
    error: { bg: 'bg-red-50/80', border: 'border-red-400', text: 'text-red-800' },
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 mb-6 rounded-lg border backdrop-blur-sm ${styles[type].bg} ${styles[type].border} ${styles[type].text} text-sm flex justify-between items-center shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <ShieldCheck size={20} />
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="font-bold text-lg leading-none">&times;</button>
    </motion.div>
  );
};

// --- Composant Champ de Formulaire ---
const InputField = ({ icon, ...props }) => (
  <div className="relative group">
    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors duration-300">{icon}</div>
    <input {...props} className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 placeholder-gray-500 text-white" />
  </div>
);

// --- Formulaire d'Authentification (Connexion / Inscription) ---
const AuthForm = ({ setAlert, setToken, setIsLoggedIn }) => {
    const [view, setView] = useState('login');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ nom: '', email: '', password: '', confirmPassword: '' });

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            return setAlert({ message: "Les mots de passe ne correspondent pas.", type: 'error' });
        }
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nom: registerData.nom, email: registerData.email, password: registerData.password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erreur lors de l'inscription");
            setAlert({ message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.', type: 'success' });
            setView('login');
        } catch (error) {
            setAlert({ message: error.message, type: 'error' });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Email ou mot de passe incorrect.');
            setToken(data.token);
            setIsLoggedIn(true);
        } catch (error) {
            setAlert({ message: error.message, type: 'error' });
        }
    };

    const formVariants = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 30 } };
    const activeClass = "border-b-2 border-amber-500 text-white";
    const inactiveClass = "text-gray-500 hover:text-amber-400";

    return (
        <div className="bg-black/50 backdrop-blur-xl border border-gray-800/50 p-8 md:p-10 rounded-xl shadow-2xl shadow-black/30 w-full max-w-md">
            <div className="flex justify-center mb-8">
                <button onClick={() => setView('login')} className={`py-3 px-6 text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${view === 'login' ? activeClass : inactiveClass}`}>Connexion</button>
                <button onClick={() => setView('register')} className={`py-3 px-6 text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${view === 'register' ? activeClass : inactiveClass}`}>Inscription</button>
            </div>
            <AnimatePresence mode="wait">
                {view === 'login' ? (
                    <motion.form key="login" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleLogin} className="space-y-6">
                        <InputField icon={<Mail size={20} />} type="email" name="email" value={loginData.email} onChange={handleLoginChange} placeholder="Adresse e-mail" required />
                        <InputField icon={<KeyRound size={20} />} type="password" name="password" value={loginData.password} onChange={handleLoginChange} placeholder="Mot de passe" required />
                        <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-900 py-3 rounded-lg font-bold uppercase tracking-widest hover:from-amber-400 hover:to-yellow-500 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                            Entrer <ArrowRight size={18}/>
                        </button>
                    </motion.form>
                ) : (
                    <motion.form key="register" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleRegister} className="space-y-5">
                        <InputField icon={<User size={20} />} type="text" name="nom" value={registerData.nom} onChange={handleRegisterChange} placeholder="Nom complet" required />
                        <InputField icon={<Mail size={20} />} type="email" name="email" value={registerData.email} onChange={handleRegisterChange} placeholder="Adresse e-mail" required />
                        <InputField icon={<KeyRound size={20} />} type="password" name="password" value={registerData.password} onChange={handleRegisterChange} placeholder="Créer un mot de passe" required />
                        <InputField icon={<KeyRound size={20} />} type="password" name="confirmPassword" value={registerData.confirmPassword} onChange={handleRegisterChange} placeholder="Confirmer le mot de passe" required />
                        <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-900 py-3 rounded-lg font-bold uppercase tracking-widest hover:from-amber-400 hover:to-yellow-500 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                           S'inscrire <ArrowRight size={18}/>
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Formulaire de Candidature ---
const ApplicationForm = ({ token, setAlert }) => {
    const [applicationData, setApplicationData] = useState({ telephone: '', poste: 'Agent Commercial / Réceptionniste', motivation: '', cv: null });
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setApplicationData({ ...applicationData, [name]: files ? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(applicationData).forEach(key => formData.append(key, applicationData[key]));
        try {
            const response = await fetch(`${API_URL}/api/candidatures`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Erreur lors de l'envoi.");
            setAlert({ message: 'Votre candidature a été envoyée avec succès ! Nous vous remercions.', type: 'success' });
            setApplicationData({ telephone: '', poste: 'Agent Commercial / Réceptionniste', motivation: '', cv: null });
        } catch (error) {
            setAlert({ message: error.message, type: 'error' });
        }
    };
    
    return (
        <div className="bg-black/50 backdrop-blur-xl border border-gray-800/50 p-8 md:p-10 rounded-xl shadow-2xl shadow-black/30 w-full max-w-2xl">
            <h2 className="text-3xl font-bold text-center text-white mb-2">Déposez Votre Candidature</h2>
            <p className="text-center text-gray-400 mb-8">Nous sommes impatients de découvrir votre profil.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField icon={<Phone size={20}/>} type="tel" name="telephone" placeholder="Numéro de téléphone" value={applicationData.telephone} onChange={handleChange} required />
                <div className="relative group">
                    <Briefcase size={20} className="text-gray-400 absolute top-1/2 left-4 transform -translate-y-1/2 group-focus-within:text-amber-500 transition-colors duration-300"/>
                    <select name="poste" value={applicationData.poste} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 text-white">
                        <option>Agent Commercial / Réceptionniste</option>
                        <option>Secrétaire</option>
                    </select>
                </div>
                <div className="relative group">
                    <FileText size={20} className="text-gray-400 absolute top-4 left-4 group-focus-within:text-amber-500 transition-colors duration-300"/>
                    <textarea name="motivation" placeholder="Lettre de motivation" rows="5" value={applicationData.motivation} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 placeholder-gray-500 text-white" required></textarea>
                </div>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-500/10 transition-all duration-300">
                    <label htmlFor="cv-upload" className="flex flex-col items-center gap-2 cursor-pointer">
                        <Upload size={30} className="text-gray-500"/>
                        <span className="font-semibold text-amber-400">
                           {applicationData.cv ? applicationData.cv.name : "Cliquez pour téléverser votre CV"}
                        </span>
                        <span className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</span>
                    </label>
                    <input id="cv-upload" type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleChange} className="hidden" required />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:from-green-400 hover:to-emerald-500 transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transform hover:-translate-y-1">
                    Envoyer ma candidature
                </button>
            </form>
        </div>
    );
};

// --- Composant Principal de l'Application ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [alert, setAlert] = useState({ message: '', type: 'success' });

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setAlert({ message: "Vous avez été déconnecté.", type: 'success' });
  };
  
  const clearAlert = () => setAlert({ message: '', type: 'success'});

  const pageVariants = { initial: { opacity: 0, scale: 0.98 }, in: { opacity: 1, scale: 1 }, out: { opacity: 0, scale: 0.98 } };
  const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.5 };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')"}}>
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-gray-800/50 shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-2 rounded-lg shadow-md">
             <Car className="h-6 w-6 text-gray-900" />
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Casbah-Luxe <span className="font-light">Automobile</span></h1>
        </div>
        {isLoggedIn && (
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={16} />
            Déconnexion
          </button>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
        <AnimatePresence mode="wait">
            <motion.div
                key={isLoggedIn ? 'app-form' : 'auth-form'}
                className="w-full flex flex-col items-center"
                variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}
            >
                {!isLoggedIn && (
                  <div className="text-center mb-8">
                      <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">Rejoignez une <span className="text-amber-400">équipe d'exception</span></h2>
                      <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">Saisissez l'opportunité de redéfinir l'expérience automobile à Alger. Créez un compte pour postuler.</p>
                  </div>
                )}
                
                <div className="w-full max-w-2xl px-4">
                  <Alert message={alert.message} type={alert.type} onClose={clearAlert} />
                </div>
                
                {isLoggedIn ? (
                  <ApplicationForm token={token} setAlert={setAlert} />
                ) : (
                  <AuthForm setAlert={setAlert} setToken={setToken} setIsLoggedIn={setIsLoggedIn} />
                )}
            </motion.div>
        </AnimatePresence>
      </main>
      
      <footer className="text-center p-6 text-gray-600 text-sm mt-8">
        &copy; {new Date().getFullYear()} Casbah-Luxe Automobile. Tous droits réservés.
      </footer>
    </div>
  );
}
