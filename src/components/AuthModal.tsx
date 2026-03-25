"use client";

import { useState } from "react";
import { X, Mail, Lock, Loader2, ArrowRight, User } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!auth) {
      setError("Firebase keys missing! Please add them to your .env.local file.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: username });
        }
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-artisanal-dark/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-cream-50 w-full max-w-md mt-16 sm:mt-24 rounded-[2rem] shadow-2xl border border-cream-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="flex justify-between items-center p-6 border-b border-cream-100 bg-white">
          <h2 className="font-serif text-2xl font-bold text-artisanal-dark">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <button onClick={onClose} className="text-artisanal-dark/40 hover:text-artisanal-dark transition-colors p-2 bg-cream-50 hover:bg-cream-100 rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-2xl text-xs font-bold font-sans">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-artisanal-dark/40 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-artisanal-dark/30" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-cream-200 bg-white outline-none focus:border-artisanal-brown font-medium text-artisanal-dark transition-colors"
                  placeholder="ArtisanBaker123"
                  required={!isLogin}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-artisanal-dark/40 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-artisanal-dark/30" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-cream-200 bg-white outline-none focus:border-artisanal-brown font-medium text-artisanal-dark transition-colors"
                  placeholder="baker@archive.local"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-artisanal-dark/40 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-artisanal-dark/30" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-cream-200 bg-white outline-none focus:border-artisanal-brown font-medium text-artisanal-dark transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full group flex justify-center items-center bg-artisanal-brown text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:bg-artisanal-dark transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                {isLogin ? "Sign In" : "Register"}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="flex flex-col gap-4 pt-4 border-t border-cream-100">
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-xs font-bold text-artisanal-dark/50 hover:text-artisanal-brown transition-colors"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
            
            <button 
              type="button"
              onClick={onClose}
              className="text-xs border border-cream-200 bg-white text-artisanal-dark py-3 rounded-full font-bold uppercase tracking-widest hover:bg-cream-100 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
