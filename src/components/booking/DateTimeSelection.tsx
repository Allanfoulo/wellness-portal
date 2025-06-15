
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { format, addDays, setHours, setMinutes, isBefore, isAfter, isSameDay } from 'date-fns';

interface Service {
  id: string;
  name: string;
  duration: number;
}

interface DateTimeSelectionProps {
  service: Service;
  onDateTimeSelect: (datetime: Date) => void;
  selectedDateTime?: Date;
}

export const DateTimeSelection = ({ service, onDateTimeSelect, selectedDateTime }: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selectedDateTime);
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);

  // Generate available time slots for the selected date
  const generateTimeSlots = (date: Date) => {
    const slots: Date[] = [];
    const businessHours = {
      start: 9, // 9 AM
      end: 18,  // 6 PM
    };

    // Don't allow booking for past dates
    if (isBefore(date, new Date().setHours(0, 0, 0, 0))) {
      return slots;
    }

    const slotDuration = 30; // 30-minute slots
    const serviceDurationSlots = Math.ceil(service.duration / slotDuration);

    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotTime = setMinutes(setHours(date, hour), minute);
        
        // Check if there's enough time for the service before business hours end
        const serviceEndTime = new Date(slotTime.getTime() + service.duration * 60000);
        const businessEndTime = setHours(date, businessHours.end);
        
        if (isBefore(serviceEndTime, businessEndTime) || serviceEndTime.getTime() === businessEndTime.getTime()) {
          // Don't allow booking slots in the past for today
          if (isSameDay(date, new Date()) && isBefore(slotTime, new Date())) {
            continue;
          }
          slots.push(slotTime);
        }
      }
    }

    return slots;
  };

  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setAvailableSlots(slots);
    }
  }, [selectedDate, service.duration]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (selectedDateTime && date && !isSameDay(selectedDateTime, date)) {
      // Clear selected time if date changed
      onDateTimeSelect(date);
    }
  };

  const handleTimeSelect = (time: Date) => {
    onDateTimeSelect(time);
  };

  const formatTimeSlot = (date: Date) => {
    return format(date, 'h:mm a');
  };

  // Disable past dates and weekends for simplicity
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today) || date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-semibold text-charcoal-800 mb-2">
          Select Date & Time
        </h2>
        <p className="text-charcoal-600">
          Choose your preferred appointment time for {service.name}
        </p>
        <Badge variant="outline" className="mt-2">
          <Clock className="w-3 h-3 mr-1" />
          {service.duration} minutes
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair">Select Date</CardTitle>
            <CardDescription>Choose an available date (weekdays only)</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border"
              fromDate={new Date()}
              toDate={addDays(new Date(), 30)}
            />
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair">Available Times</CardTitle>
            <CardDescription>
              {selectedDate 
                ? `Available slots for ${format(selectedDate, 'MMMM d, yyyy')}`
                : 'Please select a date first'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <Button
                      key={slot.toISOString()}
                      variant={selectedDateTime?.getTime() === slot.getTime() ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTimeSelect(slot)}
                      className="text-xs"
                    >
                      {formatTimeSlot(slot)}
                    </Button>
                  ))
                ) : (
                  <p className="text-charcoal-600 col-span-3 text-center py-4">
                    No available slots for this date
                  </p>
                )}
              </div>
            ) : (
              <p className="text-charcoal-600 text-center py-8">
                Select a date to see available times
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
