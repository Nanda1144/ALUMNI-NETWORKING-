import React, { useState, useCallback } from 'react';
import { MOCK_EVENTS, MOCK_USERS } from '../constants';
import { EventMatch, Event } from '../types';
import { Calendar, MapPin, Users, Sparkles, Check } from 'lucide-react';
import { generateEventRecommendations } from '../services/geminiService';

const Events: React.FC = () => {
  // Mock current user - typically from auth context
  const currentUser = MOCK_USERS[4]; 
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<EventMatch[] | null>(null);
  
  // Initialize events with current user's RSVPs from mock data
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [filter, setFilter] = useState<'all' | 'registered'>('all');

  const handleAIRecommendations = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const results = await generateEventRecommendations(currentUser, events);
    setMatches(results);
    setLoading(false);
  }, [currentUser, loading, events]);

  const toggleRSVP = (eventId: string) => {
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === eventId) {
        const isRegistered = event.attendeeIds.includes(currentUser.id);
        const newAttendeeIds = isRegistered 
          ? event.attendeeIds.filter(id => id !== currentUser.id)
          : [...event.attendeeIds, currentUser.id];
        
        return {
          ...event,
          attendeeIds: newAttendeeIds,
          attendees: isRegistered ? event.attendees - 1 : event.attendees + 1
        };
      }
      return event;
    }));
  };

  const getEventMatch = (eventId: string) => matches?.find(m => m.eventId === eventId);

  const displayedEvents = events
    .filter(event => filter === 'all' || event.attendeeIds.includes(currentUser.id))
    .sort((a, b) => {
      if (!matches) return 0;
      const matchA = getEventMatch(a.id);
      const matchB = getEventMatch(b.id);
      const scoreA = matchA?.matchScore || 0;
      const scoreB = matchB?.matchScore || 0;
      return scoreB - scoreA;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Upcoming Events</h2>
           <p className="text-slate-500 text-sm">Connect with the community</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
            <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                All Events
              </button>
              <button 
                onClick={() => setFilter('registered')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'registered' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                My Events
              </button>
            </div>

            <button 
                onClick={handleAIRecommendations}
                disabled={loading}
                className={`
                    px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2
                    ${loading ? 'opacity-75 cursor-wait' : ''}
                `}
            >
                {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {matches ? 'Refresh Picks' : 'Get AI Recommendations'}
            </button>
            <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
            + Create Event
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedEvents.map(event => {
          const match = getEventMatch(event.id);
          const isRegistered = event.attendeeIds.includes(currentUser.id);

          return (
            <div key={event.id} className={`bg-white rounded-xl shadow-sm border ${match ? 'border-violet-300 ring-2 ring-violet-100' : 'border-slate-100'} overflow-hidden flex flex-col h-full hover:translate-y-[-2px] transition-transform duration-300 relative`}>
              {match && (
                  <div className="absolute top-0 right-0 z-10 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                      {match.matchScore}% Match
                  </div>
              )}
              
              <div className="relative h-48">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wide">
                  {event.type}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3">{event.description}</p>
                </div>

                {match && (
                   <div className="mb-4 p-3 bg-violet-50 border border-violet-100 rounded-lg">
                      <p className="text-xs text-violet-800 flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          {match.reason}
                      </p>
                   </div>
                )}
                
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="w-4 h-4 mr-2 text-indigo-500" />
                    {event.attendees} Attending
                  </div>
                </div>

                <button 
                  onClick={() => toggleRSVP(event.id)}
                  className={`w-full mt-6 px-4 py-2 font-medium rounded-lg transition-all flex items-center justify-center gap-2
                    ${isRegistered 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200' 
                      : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                  {isRegistered ? (
                    <>
                      <Check className="w-4 h-4" /> Registered
                    </>
                  ) : 'Register Now'}
                </button>
              </div>
            </div>
          );
        })}
        {displayedEvents.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
             {filter === 'registered' ? "You haven't registered for any events yet." : "No upcoming events found."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;