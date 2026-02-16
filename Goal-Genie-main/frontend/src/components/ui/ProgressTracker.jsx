import { motion } from 'framer-motion';

const ProgressTracker = ({ progress }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Progress</h3>
        <span className="text-lg font-medium text-indigo-600">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
        />
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        {progress === 100 ? (
          <span className="text-green-500">🎉 Congratulations! You've completed all tasks!</span>
        ) : (
          <span>Keep going! You're making great progress!</span>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker; 