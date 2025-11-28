"use client"

import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState<any>(null);
  useEffect(() => {
    async function fetchQuestion() {
      const { data, error } = await supabase
        .from('question')
        .select('*')
        .limit(1);

      if (error) console.error(error);
      else console.log(data);
    }

    fetchQuestion();
  }, []);

  return <h1>Bienvenue sur CyberQuiz</h1>;
}