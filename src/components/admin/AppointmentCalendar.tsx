import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  status: string;
  created_at: string;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onSelectAppointment?: (appointment: Appointment) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-green-500',
  completed: 'bg-blue-500',
  cancelled: 'bg-red-500',
};

export function AppointmentCalendar({ appointments, onSelectAppointment }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { year, month, daysInMonth, firstDayOfMonth, monthName } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    return { year, month, daysInMonth, firstDayOfMonth, monthName };
  }, [currentDate]);

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach(apt => {
      const date = apt.preferred_date;
      if (!map[date]) map[date] = [];
      map[date].push(apt);
    });
    return map;
  }, [appointments]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = new Date();
  const isToday = (day: number) => {
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const formatDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const days = [];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-muted/30" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(day);
    const dayAppointments = appointmentsByDate[dateKey] || [];
    const hasAppointments = dayAppointments.length > 0;

    days.push(
      <div
        key={day}
        className={`h-24 md:h-32 border border-border p-1 overflow-hidden ${
          isToday(day) ? 'bg-primary/10 border-primary' : 'bg-card'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
            {day}
          </span>
          {hasAppointments && (
            <Badge variant="secondary" className="text-xs">
              {dayAppointments.length}
            </Badge>
          )}
        </div>
        <div className="space-y-0.5 overflow-y-auto max-h-[calc(100%-24px)]">
          {dayAppointments.slice(0, 3).map(apt => (
            <button
              key={apt.id}
              onClick={() => onSelectAppointment?.(apt)}
              className={`w-full text-left text-xs p-1 rounded truncate text-white ${statusColors[apt.status]} hover:opacity-80 transition-opacity`}
            >
              {apt.preferred_time} - {apt.customer_name}
            </button>
          ))}
          {dayAppointments.length > 3 && (
            <p className="text-xs text-muted-foreground text-center">
              +{dayAppointments.length - 3} more
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="card-elegant">
      <CardContent className="p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
          <h2 className="font-display text-xl font-semibold">{monthName}</h2>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-px mb-px">
          {weekDays.map(day => (
            <div key={day} className="bg-muted p-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px">
          {days}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>Cancelled</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
