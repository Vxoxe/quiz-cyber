"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [question, setQuestion] = useState<any>(null);

  useEffect(() => {
    async function fetchQuestion() {
      const { data, error } = await supabase
        .from("question")
        .select(`
          id,
          texte,
          image_url,
          image_credit_nom,
          image_credit_url,
          reponses:reponse (
            id,
            texte,
            est_correcte
          )
        `)
        .order("id", { ascending: true });

      if (error) {
        console.error("Erreur Supabase :", error);
      } else {
        setQuestion(data?.[0]); // On prend la première question du tableau
      }
    }

    fetchQuestion();
  }, []);

  function handleClick(reponse: any) {
    if (reponse.est_correcte) {
      alert("Bonne réponse !");
    } else {
      alert("Mauvaise réponse.");
    }
  }

  return (
    <div>
      <Alert className="bg-blue-50 border-blue-300 text-blue-800 max-w-xl mx-auto mt-6">
        <AlertTitle className="text-xl font-semibold">Bienvenue sur CyberQuiz</AlertTitle>
        <AlertDescription>
          Un quiz pour tester vos connaissances en cybersécurité.
        </AlertDescription>
      </Alert>

      {question ? (
        <Card className="max-w-4xl mx-auto mt-6">
          <div className="flex">
            {/* Colonne gauche : image + crédit */}
            <div className="w-1/2 p-4">
              {question.image_url ? (
                <Image
                  src={question.image_url}
                  alt="Illustration de la question"
                  width={400}
                  height={300}
                  className="rounded"
                />
              ) : (
                <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-sm text-gray-500 rounded">
                  Aucune image disponible
                </div>
              )}

              {question.image_credit_nom && question.image_credit_url && (
                <Alert className="mt-4 text-sm text-muted-foreground">
                  <AlertDescription>
                    <span className="inline">
                      Image :{" "}
                      <Link
                        href={question.image_credit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-primary"
                      >
                        {question.image_credit_nom}
                      </Link>
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </div>

           
            <div className="w-1/2 p-4">
              <CardHeader className="p-0 mb-4">
                <CardTitle>Question</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg font-semibold mb-4">{question.texte}</p>
                {question.reponses.map((reponse: any) => (
                  <Button
                    key={reponse.id}
                    onClick={() => handleClick(reponse)}
                    className="w-full justify-start mt-2"
                    variant="outline"
                  >
                    {reponse.texte}
                  </Button>
                ))}
              </CardContent>
            </div>
          </div>
        </Card>
      ) : (
        <p className="text-center mt-6">Chargement de la question...</p>
      )}
    </div>
  );
}