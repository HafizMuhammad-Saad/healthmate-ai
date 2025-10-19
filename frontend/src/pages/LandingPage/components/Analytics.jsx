import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Briefcase, Target } from 'lucide-react'

const Analytics = () => {

    const stats = [
        {
            icon: Users,
            value: '10,000+',
            title: 'Active Users',
            growth: '+20%',
            color: 'purple',
            percentage: '75%'
        },
        {
            icon: Briefcase,
            value: '1,000+',
            title: 'Companies',
            growth: '-5%',
            color: 'blue',
            percentage: '25%'

        },
        {
            icon: TrendingUp,
            value: '50,000+',
            title: 'Jobs Posted',
            growth: '+10%',
            color: 'orange',
            percentage: '50%'
        },
        {   icon: Target,
            value: '95%',
            title: 'Job Success Rate',
            growth: '+5%',
            color: 'green',
            percentage: '90%'
        },

    ];

  return (
    <section className='relative py-24 overflow-hidden'>
  {/* Decorative elements */}
  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-50 to-transparent -z-10" />
  <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-purple-100 blur-3xl opacity-20 -z-10" />
  
  <div className="container mx-auto px-4">
    {/* Animated header */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="max-w-3xl mx-auto text-center mb-20"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Platform <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Analytics</span>
      </h2>
      <p className="text-xl text-gray-600 leading-relaxed">
        Real-time insights demonstrating our transformative impact on the job market
      </p>
    </motion.div>

    {/* Stats grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            scale: { type: "spring", stiffness: 300 }
          }}
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ y: -8 }}
          className="relative group"
        >
          {/* Card background */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-10 from-${stat.color}-100 to-${stat.color}-50 group-hover:opacity-20 transition-opacity`} />
          
          {/* Main card */}
          <div className="relative h-full bg-white rounded-2xl p-8 shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${stat.color}-100 text-${stat.color}-800`}>
                {stat.growth} ↑
              </span>
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {stat.value}
            </h3>
            <p className="text-gray-600 mb-4">{stat.title}</p>
            
            {/* Animated progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: stat.percentage }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
                className={`h-2 rounded-full bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>

   
  </div>
</section>
  )
}

export default Analytics
