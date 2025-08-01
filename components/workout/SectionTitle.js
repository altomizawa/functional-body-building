'use client'
import ideaIcon from '@/public/icons/idea.svg';
import { Lightbulb, Hourglass, Anvil, Scale, Snowflake, Thermometer, Dumbbell} from 'lucide-react';
import { useState, useEffect } from 'react';

const SectionTitle = ({ title }) => {
  const [icon, setIcon] = useState(<Lightbulb className="w-4 h-4 mr-2" />);

  useEffect(() => {
    if (title.toLowerCase().includes('coach notes')) {
      setIcon(<Lightbulb className="w-4 h-4 mr-2" />);
    }
    if (title.toLowerCase().includes('short on time')) {
      setIcon(<Hourglass className="w-4 h-4 mr-2" />);
    }
    if (title.toLowerCase().includes('warm-up')) {
      setIcon(<Thermometer className="w-4 h-4 mr-2" />);
    }
    if (title.toLowerCase().includes('strength intensity')) {
      setIcon(<Anvil className="w-4 h-4 mr-2" />);
    }
    if (title.toLowerCase().includes('strength balance')) {
      setIcon(<Scale className="w-4 h-4 mr-2" />);
    }
    if (title.toLowerCase().includes('endurance') || title.toLowerCase().includes('fatigued')) {
      setIcon(<Dumbbell className="w-4 h-4 mr-2" />);
    }
    if (title.toLowerCase().includes('cooldown')) {
      setIcon(<Snowflake className="w-4 h-4 mr-2" />);
    }
  }, []);

  return (
    <div className="w-full bg-black px-4 py-2 mt-8">
      <h3 className="text-white font-bold text-base flex items-center uppercase">
        {icon}
        {title}
      </h3>
    </div>
  )
}

export default SectionTitle
