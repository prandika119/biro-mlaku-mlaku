export class TripResponse {
  id: number;
  name: string;
  description?: string;
  location: string;
  start_date: Date;
  end_date: Date;
}

export class TripParticipantResponse {
  id: number;
  tripId: number;
  userId: number;
  status: 'JOINING' | 'PENDING' | 'CANCELLED' | 'COMPLETED';
  userName: string;
  userEmail: string;
  userPhone: string;
  tripName: string;
  tripLocation: string;
  tripDescription: string;
  tripStartDate: string;
  tripEndDate: string;
  createdAt: string;
}

export class CreateTripRequest {
  name: string;
  description?: string;
  location: string;
  start_date: Date;
  end_date: Date;
}

export class UpdateTripRequest {
  name?: string;
  description?: string;
  location?: string;
  start_date?: Date;
  end_date?: Date;
}
