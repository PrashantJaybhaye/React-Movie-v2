import React from 'react';
import { validatePassword } from '../utils/auth';

const PasswordStrength = ({ password, showRequirements = true }) => {
    const validation = validatePassword(password);
    const { requirements, strength } = validation;

    const getStrengthColor = () => {
        switch (strength) {
            case 'weak': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'strong': return 'bg-green-500';
            default: return 'bg-gray-300';
        }
    };

    const getStrengthWidth = () => {
        switch (strength) {
            case 'weak': return 'w-1/3';
            case 'medium': return 'w-2/3';
            case 'strong': return 'w-full';
            default: return 'w-0';
        }
    };

    if (!password) return null;

    return (
        <div className="mt-2">
            {/* Strength Bar */}
            <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs text-gray-300">Password strength:</span>
                <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
                    />
                </div>
                <span className={`text-xs font-medium capitalize ${
                    strength === 'weak' ? 'text-red-400' :
                    strength === 'medium' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                    {strength}
                </span>
            </div>

            {/* Requirements List */}
            {showRequirements && (
                <div className="space-y-1">
                    <RequirementItem 
                        met={requirements.minLength} 
                        text="At least 8 characters" 
                    />
                    <RequirementItem 
                        met={requirements.hasUpperCase} 
                        text="One uppercase letter" 
                    />
                    <RequirementItem 
                        met={requirements.hasLowerCase} 
                        text="One lowercase letter" 
                    />
                    <RequirementItem 
                        met={requirements.hasNumber} 
                        text="One number" 
                    />
                </div>
            )}
        </div>
    );
};

const RequirementItem = ({ met, text }) => (
    <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
            met ? 'bg-green-500' : 'bg-gray-500'
        }`}>
            {met && (
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            )}
        </div>
        <span className={`text-xs ${met ? 'text-green-400' : 'text-gray-400'}`}>
            {text}
        </span>
    </div>
);

export default PasswordStrength;
