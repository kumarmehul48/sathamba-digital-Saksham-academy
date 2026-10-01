import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { Card, Badge, Empty } from '../../components/ui';
import type { GalleryItem } from '../../types/database';

const CATEGORIES = ['Classroom', 'Student Activities', 'Projects', 'Events', 'Workshops', 'Academy Activities'];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [cat, setCat] = useState('All');

  useEffect(() => {
    supabase.from('gallery').select('*').eq('is_published', true).order('sort_order')
      .then(({ data }) => setItems(data as GalleryItem[] | null));
  }, []);

  const shown = (items ?? []).filter((g) => cat === 'All' || g.category === cat);

  return (
    <div>
      <div className="bg-primary text-white py-14 text-center">
        <h1 className="text-3xl font-extrabold mb-1">Gallery</h1>
        <p className="text-accent text-sm font-semibold">Sathamba Digital Saksham Academy (SDSA) | Learning & Activities</p>
      </div>
      <div className="container-sdsa section-pad">
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-bold ${cat === c ? 'bg-primary text-white' : 'bg-primary-50 text-primary hover:bg-accent-light'}`}>{c}</button>
          ))}
        </div>
        {shown.length === 0 ? (
          <Empty text="Gallery photos coming soon - academy practical activities and events will be published here." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {shown.map((g) => (
              <Card key={g.id} className="!p-0 overflow-hidden">
                <img src={g.image_url} alt={g.title} loading="lazy" className="w-full h-40 object-cover" />
                <div className="p-3"><Badge tone="primary">{g.category}</Badge><p className="text-sm font-semibold mt-1">{g.title}</p></div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
