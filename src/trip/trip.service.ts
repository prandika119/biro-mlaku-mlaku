import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  CreateTripRequest,
  UpdateTripRequest,
  TripResponse,
  TripParticipantResponse,
} from '../model/trip.model';
import { TripValidation } from './trip.validation';
import { ParticipantStatus } from '@prisma/client';
import { log, info } from 'console';

@Injectable()
export class TripService {
  constructor(
    private ValidationService: ValidationService,
    private PrismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async getTrips(): Promise<TripResponse[]> {
    const trips = await this.PrismaService.trip.findMany();
    return trips;
  }

  async getTrip(id: number): Promise<TripResponse> {
    const trip = await this.PrismaService.trip.findUnique({
      where: { id },
    });

    if (!trip) {
      throw new HttpException('Trip not found', 404);
    }

    return trip;
  }

  async createTrip(request: CreateTripRequest): Promise<TripResponse> {
    this.logger.info('Creating new trip', { request });
    const createTripRequest: CreateTripRequest =
      this.ValidationService.validate(
        TripValidation.CREATE,
        request,
      ) as CreateTripRequest;
    this.logger.info('Validated create trip request', { createTripRequest });
    const startDate = new Date(createTripRequest.start_date);
    const endDate = new Date(createTripRequest.end_date);
    const trip = await this.PrismaService.trip.create({
      data: {
        name: createTripRequest.name,
        location: createTripRequest.location,
        description: createTripRequest.description ?? '',
        start_date: startDate,
        end_date: endDate,
      },
    });
    return trip;
  }
  async updateTrip(
    id: number,
    request: UpdateTripRequest,
  ): Promise<TripResponse> {
    this.logger.info('Updating trip', { id, request });
    const updateTripRequest: UpdateTripRequest =
      this.ValidationService.validate(
        TripValidation.UPDATE,
        request,
      ) as UpdateTripRequest;
    this.logger.info('Validated update trip request', {
      id,
      updateTripRequest,
    });

    // Cek trip exist
    const existingTrip = await this.PrismaService.trip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      throw new HttpException('Trip not found', 404);
    }
    if (updateTripRequest.start_date) {
      updateTripRequest.start_date = new Date(updateTripRequest.start_date);
    }

    if (updateTripRequest.end_date) {
      updateTripRequest.end_date = new Date(updateTripRequest.end_date);
    }
    const trip = await this.PrismaService.trip.update({
      where: { id },
      data: {
        name: updateTripRequest.name,
        location: updateTripRequest.location,
        description: updateTripRequest.description ?? '',
        start_date: updateTripRequest.start_date,
        end_date: updateTripRequest.end_date,
      },
    });
    return trip;
  }

  async deleteTrip(id: number): Promise<void> {
    this.logger.info('Deleting trip', { id });

    // Cek trip exist
    const existingTrip = await this.PrismaService.trip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      throw new HttpException('Trip not found', 404);
    }

    await this.PrismaService.trip.delete({
      where: { id },
    });
  }

  async addParticipantToTrip(
    tripId: number,
    userId: number,
  ): Promise<TripParticipantResponse> {
    // Cek trip exist
    const existingTrip = await this.PrismaService.trip.findUnique({
      where: { id: tripId },
    });

    if (!existingTrip) {
      throw new HttpException('Trip not found', 404);
    }

    // Cek user exist
    const existingUser = await this.PrismaService.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new HttpException('User not found', 404);
    }

    // Cek apakah user sudah menjadi participant di trip ini
    const existingParticipant =
      await this.PrismaService.tripParticipant.findFirst({
        where: {
          tripId: tripId,
          userId: userId,
        },
      });

    if (existingParticipant) {
      throw new HttpException(
        'User is already a participant in this trip',
        400,
      );
    }

    // Tambah participant
    const participant = await this.PrismaService.tripParticipant.create({
      data: {
        tripId: tripId,
        userId: userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        trip: {
          select: {
            name: true,
            location: true,
            description: true,
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    return {
      id: participant.id,
      tripId: participant.tripId,
      userId: participant.userId,
      status: participant.status,
      userName: participant.user.name,
      userEmail: participant.user.email,
      userPhone: participant.user.phone,
      tripName: participant.trip.name,
      tripLocation: participant.trip.location,
      tripDescription: participant.trip.description,
      tripStartDate: participant.trip.start_date.toISOString(),
      tripEndDate: participant.trip.end_date.toISOString(),
      createdAt: participant.createdAt.toISOString(),
    };
  }

  async getParticipantsOfTrip(
    tripId: number,
  ): Promise<TripParticipantResponse[]> {
    // Cek trip exist
    const existingTrip = await this.PrismaService.trip.findUnique({
      where: { id: tripId },
    });

    if (!existingTrip) {
      throw new HttpException('Trip not found', 404);
    }

    const participants = await this.PrismaService.tripParticipant.findMany({
      where: { tripId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        trip: {
          select: {
            name: true,
            location: true,
            description: true,
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    return participants.map((participant) => ({
      id: participant.id,
      tripId: participant.tripId,
      userId: participant.userId,
      status: participant.status,
      userName: participant.user?.name,
      userEmail: participant.user?.email,
      userPhone: participant.user?.phone,
      tripName: participant.trip?.name,
      tripLocation: participant.trip?.location,
      tripDescription: participant.trip?.description,
      tripStartDate: participant.trip?.start_date?.toISOString(),
      tripEndDate: participant.trip?.end_date?.toISOString(),
      createdAt: participant.createdAt.toISOString(),
    }));
  }

  async updateParticipantTrip(
    tripId: number,
    userId: number,
    status: 'JOINING' | 'PENDING' | 'CANCELLED' | 'COMPLETED',
  ): Promise<TripParticipantResponse> {
    const validStatuses = ['JOINING', 'PENDING', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      throw new HttpException('Invalid status', 400);
    }

    // Cek trip exist
    const existingTrip = await this.PrismaService.trip.findUnique({
      where: { id: tripId },
    });

    if (!existingTrip) {
      throw new HttpException('Trip not found', 404);
    }

    // Cek participant exist
    const existingParticipant =
      await this.PrismaService.tripParticipant.findFirst({
        where: {
          tripId: tripId,
          userId: userId,
        },
      });

    if (!existingParticipant) {
      throw new HttpException('Participant not found', 404);
    }

    // Update participant using ID
    const updatedParticipant = await this.PrismaService.tripParticipant.update({
      where: {
        id: existingParticipant.id,
      },
      data: {
        status: status as ParticipantStatus,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        trip: {
          select: {
            name: true,
            location: true,
            description: true,
            start_date: true,
            end_date: true,
          },
        },
      },
    });

    return {
      id: updatedParticipant.id,
      tripId: updatedParticipant.tripId,
      userId: updatedParticipant.userId,
      status: updatedParticipant.status,
      userName: updatedParticipant.user?.name,
      userEmail: updatedParticipant.user?.email,
      userPhone: updatedParticipant.user?.phone,
      tripName: updatedParticipant.trip?.name,
      tripLocation: updatedParticipant.trip?.location,
      tripDescription: updatedParticipant.trip?.description,
      tripStartDate: updatedParticipant.trip?.start_date?.toISOString(),
      tripEndDate: updatedParticipant.trip?.end_date?.toISOString(),
      createdAt: updatedParticipant.createdAt.toISOString(),
    };
  }

  async removeParticipantFromTrip(
    tripId: number,
    userId: number,
  ): Promise<void> {
    // Cek trip exist
    const existingTrip = await this.PrismaService.trip.findUnique({
      where: { id: tripId },
    });

    if (!existingTrip) {
      throw new HttpException('Trip not found', 404);
    }

    // Cek participant exist
    const existingParticipant =
      await this.PrismaService.tripParticipant.findFirst({
        where: {
          tripId: tripId,
          userId: userId,
        },
      });

    if (!existingParticipant) {
      throw new HttpException('Participant not found', 404);
    }

    await this.PrismaService.tripParticipant.delete({
      where: {
        id: existingParticipant.id,
      },
    });
  }

  async getTripHistory(userId: number): Promise<TripParticipantResponse[]> {
    const participants = await this.PrismaService.tripParticipant.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        trip: {
          select: {
            name: true,
            location: true,
            description: true,
            start_date: true,
            end_date: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return participants.map((participant) => ({
      id: participant.id,
      tripId: participant.tripId,
      userId: participant.userId,
      status: participant.status,
      userName: participant.user?.name,
      userEmail: participant.user?.email,
      userPhone: participant.user?.phone,
      tripName: participant.trip?.name,
      tripLocation: participant.trip?.location,
      tripDescription: participant.trip?.description,
      tripStartDate: participant.trip?.start_date?.toISOString(),
      tripEndDate: participant.trip?.end_date?.toISOString(),
      createdAt: participant.createdAt.toISOString(),
    }));
  }
}
