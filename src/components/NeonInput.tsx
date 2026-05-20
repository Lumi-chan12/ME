import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface NeonInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export default function NeonInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  required = false,
}: NeonInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
        {label}
      </label>
      <div
        className={`
          relative flex items-center rounded-xl border transition-all duration-300
          ${focused
            ? 'border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
            : 'border-white/10'
          }
          bg-white/5 backdrop-blur-sm
        `}
      >
        {icon && (
          <div className={`pl-3 ${focused ? 'text-cyan-400' : 'text-white/30'} transition-colors`}>
            {icon}
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent px-3 py-3 text-sm text-white/90 placeholder-white/20 outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-3 text-white/30 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
