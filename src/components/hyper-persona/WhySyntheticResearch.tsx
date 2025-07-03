import { Zap, LineChart, DollarSign } from 'lucide-react';

const WhySyntheticResearch = () => {
  return (
    <div className="mb-24">
      <h2 className="text-3xl font-bold text-indigo-600 text-center mb-12">Why Synthetic User Research?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="text-coral-500 mb-4">
            <Zap size={32} className="text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">10x Faster Results</h3>
          <p className="text-gray-600 leading-relaxed">
            Get comprehensive user insights in hours instead of weeks. No more scheduling delays or participant no-shows.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="text-coral-500 mb-4">
            <LineChart size={32} className="text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">Unlimited Scale</h3>
          <p className="text-gray-600 leading-relaxed">
            Test with hundreds or thousands of synthetic users representing your exact target demographics.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="text-coral-500 mb-4">
            <DollarSign size={32} className="text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">80% Cost Reduction</h3>
          <p className="text-gray-600 leading-relaxed">
            Dramatically reduce research costs while increasing the breadth and depth of insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhySyntheticResearch;