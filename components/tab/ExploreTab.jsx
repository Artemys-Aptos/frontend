import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { MdBorderAll } from 'react-icons/md';
import { GiBallGlow } from 'react-icons/gi';
import {
  FaPaintBrush,
  FaPortrait,
  FaCamera,
  FaRegSmileBeam,
} from 'react-icons/fa';
import { PiAlienLight } from 'react-icons/pi';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ExploreTab() {
  let [categories] = useState({
    All: { icon: MdBorderAll },
    '3D Art': { icon: GiBallGlow },
    Comic: { icon: FaPaintBrush },
    Portraits: { icon: FaPortrait },
    Photography: { icon: FaCamera },
    Anime: { icon: FaRegSmileBeam },
    'Sci-fi': { icon: PiAlienLight },
  });

  return (
    <>
      <div className="w-full ml-[220px] px-2 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex space-x-3 rounded-xl bg-black/40 p-1">
            {Object.entries(categories).map(([category, { icon: Icon }]) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-[120px] rounded-lg py-2 text-xs font-medium leading-5 text-gray-400 bg-neutral-900',
                    'flex items-center justify-center space-x-2',
                    selected
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow text-white'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-gray-500'
                  )
                }
              >
                <Icon className="w-5 h-5" />
                <span>{category}</span>
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </>
  );
}
