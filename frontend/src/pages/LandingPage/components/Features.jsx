import React from 'react';
import {
    Brain,
    Activity,
    BarChart3,
    Shield,
    Languages,
    Heart,
    Upload,
    TrendingUp,
    Lock,
    Globe,
    Smartphone,
    FileText,
    Users,
    Clock
} from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: Brain,
            title: "AI Report Analysis",
            description: "Upload your lab reports and get instant AI-powered health insights in plain English and Urdu.",
            color: "#14b8a6",
            bgColor: "bg-teal-50",
            iconColor: "text-teal-600"
        },
        {
            icon: Activity,
            title: "Vitals Tracker",
            description: "Record and monitor your blood pressure, blood sugar, weight, heart rate, and oxygen levels.",
            color: "#10b981",
            bgColor: "bg-green-50",
            iconColor: "text-green-600"
        },
        {
            icon: BarChart3,
            title: "Health Dashboard",
            description: "View your health trends with interactive charts and get personalized recommendations.",
            color: "#8b5cf6",
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600"
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your health data is encrypted and stored securely with HIPAA-compliant privacy protection.",
            color: "#ef4444",
            bgColor: "bg-red-50",
            iconColor: "text-red-600"
        },
        {
            icon: Languages,
            title: "Bilingual Support",
            description: "Get health insights in both English and Roman Urdu for better understanding and accessibility.",
            color: "#3b82f6",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600"
        },
        {
            icon: Smartphone,
            title: "Mobile Optimized",
            description: "Access your health data anywhere with our responsive design that works perfectly on all devices.",
            color: "#06b6d4",
            bgColor: "bg-cyan-50",
            iconColor: "text-cyan-600"
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-5xl mx-auto text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                        Smart Features for
                        <span className="block bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            Better Health Management
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        HealthMate AI combines artificial intelligence with healthcare expertise to make understanding your medical reports simple, accessible, and actionable.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2"
                            >
                                <div className="p-8">
                                    <div className="flex items-start gap-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`} style={{ backgroundColor: `${feature.color}15` }}>
                                            <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-6 bg-white rounded-3xl shadow-lg p-8 border border-gray-100 max-w-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Ready to take control of your health?</h3>
                                <p className="text-gray-600">Join thousands of users already using HealthMate AI</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <a
                                href="/signup"
                                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
