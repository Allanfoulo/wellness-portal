
import { Header } from '@/components/Header';
import { BookingFlow } from '@/components/booking/BookingFlow';

const Booking = () => {
  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      <div className="container-luxury py-8">
        <BookingFlow />
      </div>
    </div>
  );
};

export default Booking;
