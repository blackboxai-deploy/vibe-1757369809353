'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CharacterCreation() {
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState('Warrior');
  const [backstory, setBackstory] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const character = { name, class: characterClass, backstory };
    localStorage.setItem('character', JSON.stringify(character));
    router.push('/game');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Create Your Character</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <select
                id="class"
                value={characterClass}
                onChange={(e) => setCharacterClass(e.target.value)}
                className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded-md"
              >
                <option>Warrior</option>
                <option>Mage</option>
                <option>Rogue</option>
                <option>Cleric</option>
                <option>Ranger</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backstory">Backstory</Label>
              <Textarea
                id="backstory"
                value={backstory}
                onChange={(e) => setBackstory(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Start Adventure
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
