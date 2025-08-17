import React from 'react';
import { User, Mail, Phone, Calendar, Clock, Users, MessageSquare } from 'lucide-react';

interface Props {
  guestName: string;
  email: string;
  phone: string;
  specialRequests?: string | null;
  dateLabel: string;
  yearLabel: string;
  timeLabel: string;
  guestCount: number;
  headerSubtitle?: string;
}

const ReservationSummary: React.FC<Props> = ({
  guestName,
  email,
  phone,
  specialRequests,
  dateLabel,
  yearLabel,
  timeLabel,
  guestCount,
  headerSubtitle,
}) => {
  return (
    <div 
      className="relative overflow-hidden font-lexend border-0"
      style={{
        backgroundColor: 'var(--color-beige)',
        boxShadow: 'var(--shadow-luxury)',
        borderRadius: '0px' // Assuming card-luxury has no border radius based on your example
      }}
    >
      
      {/* Header Section */}
      <div className="relative px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="text-center space-y-4 sm:space-y-6">
          <h2 
            className="text-lg sm:text-xl lg:text-4xl 2xl:text-4xl font-extralight tracking-[0.15em]"
            style={{ color: 'hsl(var(--primary))' }}
          >
            RESERVATION
          </h2>
          <p
            className="text-xs sm:text-sm lg:text-base 2xl:text-base font-light tracking-wide mx-auto max-w-3xl"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            {headerSubtitle ?? 'Please review and confirm your reservation details for your dining experience at Lyma'}
          </p>
          <div 
            className="w-42 h-px mx-auto"
            style={{ backgroundColor: 'hsl(var(--primary) / 0.3)' }}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        <div className="mx-auto max-w-3xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16">
          
          {/* Left Column - Guest Information */}
          <div className="space-y-4 sm:space-y-6 pl-2 lg:pl-6">
            <div>
              <h3 
                className="text-base sm:text-md lg:text-xl 2xl:text-xl font-light tracking-wider mb-3 sm:mb-4 font-lexend"
                style={{ 
                  color: 'hsl(var(--primary))'
                }}
              >
                Guest Information
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <User 
                    className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <div>
                    <label 
                      className="text-xs uppercase tracking-wider font-light"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                      Name
                    </label>
                    <p 
                      className="text-xs sm:text-lg lg:text-lg 2xl:text-lg font-light tracking-wide"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {guestName}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Mail 
                    className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    style={{ 
                      color: 'hsl(var(--muted-foreground))',
                      minWidth: '12px',
                      minHeight: '12px'
                    }}
                  />
                  <div>
                    <label 
                      className="text-xs uppercase tracking-wider font-light"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                      Email
                    </label>
                    <p 
                      className="text-xs sm:text-base lg:text-base 2xl:text-base font-light tracking-wide"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Phone 
                    className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <div>
                    <label 
                      className="text-xs uppercase tracking-wider font-light"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                      Phone
                    </label>
                    <p 
                      className="text-xs sm:text-base lg:text-base 2xl:text-base font-light tracking-wide"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reservation Details */}
          <div className="space-y-4 sm:space-y-6 pl-2 lg:pl-8">
            <div>
              <h3 
                className="text-base sm:text-md lg:text-xl 2xl:text-xl font-light tracking-wider mb-3 sm:mb-4 font-lexend"
                style={{ 
                  color: 'hsl(var(--primary))'
                }}
              >
                Reservation Details
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Calendar 
                    className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <div>
                    <label 
                      className="text-xs uppercase tracking-wider font-light"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                      Date
                    </label>
                    <p 
                      className="text-xs sm:text-base lg:text-base 2xl:text-base font-light tracking-wide"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {dateLabel}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Clock 
                    className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <div>
                    <label 
                      className="text-xs uppercase tracking-wider font-light"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                      Time
                    </label>
                    <p 
                      className="text-xs sm:text-base lg:text-base 2xl:text-base font-light tracking-wide"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {timeLabel}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Users 
                    className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  />
                  <div>
                    <label 
                      className="text-xs uppercase tracking-wider font-light"
                      style={{ color: 'hsl(var(--muted-foreground))' }}
                    >
                      Guests
                    </label>
                    <p 
                      className="text-xs sm:text-base lg:text-base 2xl:text-base font-light tracking-wide"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Special Requests - Centered */}
          {specialRequests && (
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 text-center" style={{ borderTop: '1px solid hsl(var(--border))' }}>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                  <label 
                    className="text-xs uppercase tracking-wider font-light"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  >
                    Special Requests
                  </label>
                </div>
                <p 
                  className="text-xs sm:text-lg lg:text-lg 2xl:text-lg font-light tracking-wide"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  {specialRequests}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>  
    </div>
  );
};

export default ReservationSummary;