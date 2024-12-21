import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, add, sub } from 'date-fns';
import  { CircleX } from "lucide-react"

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: '',
    description: '',
    color: 'bg-blue-500'
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(sub(currentDate, { months: 1 }));
  };

  const handleNextMonth = () => {
    setCurrentDate(add(currentDate, { months: 1 }));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title || !newEvent.startTime || !newEvent.endTime) return;

    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    
    const dateEvents = events[dateKey] || [];
    const hasOverlap = dateEvents.some(event => {
      return (
        (newEvent.startTime >= event.startTime && newEvent.startTime < event.endTime) ||
        (newEvent.endTime > event.startTime && newEvent.endTime <= event.endTime)
      );
    });

    if (hasOverlap) {
      alert('Event time conflicts with an existing event!');
      return;
    }

    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEvent]
    }));

    setNewEvent({
      title: '',
      startTime: '',
      endTime: '',
      description: '',
      color: 'bg-blue-500'
    });
    setShowEventModal(false);
  };

  const handleDeleteEvent = (dateKey, eventIndex) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((_, index) => index !== eventIndex)
    }));
  };

  const filteredEvents = (dateKey) => {
    const dateEvents = events[dateKey] || [];
    if (!searchQuery) return dateEvents;
    
    return dateEvents.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const exportEvents = () => {
    const monthEvents = Object.entries(events).reduce((acc, [date, eventList]) => {
      if (date.startsWith(format(currentDate, 'yyyy-MM'))) {
        acc[date] = eventList;
      }
      return acc;
    }, {});

    const dataStr = JSON.stringify(monthEvents, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `calendar-events-${format(currentDate, 'yyyy-MM')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const colorOptions = [
    { label: 'Blue', value: 'bg-blue-500' },
    { label: 'Red', value: 'bg-red-500' },
    { label: 'Green', value: 'bg-green-500' },
    { label: 'Purple', value: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-6xl max-h-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg mb-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← Prev
            </button>
            <h2 className="text-2xl font-bold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button 
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Next →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: getDay(startOfMonth(currentDate)) }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2"></div>
            ))}

            {getDaysInMonth().map(date => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const dateEvents = filteredEvents(dateKey);
              
              return (
                <div
                  key={date.toString()}
                  onClick={() => handleDateClick(date)}
                  className={`
                    p-2 min-h-20 min-w-24 border rounded-lg cursor-pointer
                    ${isToday(date) ? 'bg-blue-200 border-blue-400' : ''}
                    ${selectedDate && isSameDay(date, selectedDate) ? 'border-blue-500' : ''}
                    ${getDay(date) === 0 || getDay(date) === 6 ? 'bg-gray-50' : ''}
                    hover:border-blue-300 transition-colors
                  `}
                >
                  <div className="font-medium mb-1">{format(date, 'd')}</div>
                  {dateEvents.map((event, index) => (
                    <div
                      key={index}
                      className={`text-xs p-1 mb-1 ${event.color} bg-opacity-20 rounded truncate`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={exportEvents}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Export Month
        </button>
      </div>

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Add Event'}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className=" hover:text-red-600"
              >
                <CircleX />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <select
                  value={newEvent.color}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddEvent}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Event
              </button>

              {selectedDate && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Events for this day:</h3>
                  {filteredEvents(format(selectedDate, 'yyyy-MM-dd')).map((event, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-600">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(format(selectedDate, 'yyyy-MM-dd'), index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;