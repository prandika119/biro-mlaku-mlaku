import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { RoleGuard } from '../common/role.guard';
import { AuthGuard } from '../common/auth.guard';
import {
  CreateTripRequest,
  TripParticipantResponse,
  TripResponse,
} from '../model/trip.model';
import { WebResponse } from '../model/web.model';
import { Trip } from '@prisma/client';

@Controller('/api/trips')
export class TripController {
  constructor(private tripService: TripService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getTrips(): Promise<WebResponse<TripResponse[]>> {
    const trips = await this.tripService.getTrips();
    return {
      success: true,
      data: trips,
      errors: [],
    };
  }

  @Get('/:id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getTrip(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<TripResponse>> {
    const trip = await this.tripService.getTrip(id);
    return {
      success: true,
      data: trip,
      errors: [],
    };
  }

  @Post()
  @HttpCode(201)
  @UseGuards(RoleGuard)
  async createTrip(
    @Body() request: CreateTripRequest,
  ): Promise<WebResponse<TripResponse>> {
    const trip = await this.tripService.createTrip(request);
    return {
      success: true,
      data: trip,
      errors: [],
    };
  }

  @Patch('/:id')
  @HttpCode(200)
  @UseGuards(RoleGuard)
  async updateTrip(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: CreateTripRequest,
  ): Promise<WebResponse<TripResponse>> {
    const trip = await this.tripService.updateTrip(id, request);
    return {
      success: true,
      data: trip,
      errors: [],
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(RoleGuard)
  async deleteTrip(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WebResponse<boolean>> {
    await this.tripService.deleteTrip(id);
    return {
      success: true,
      data: true,
      errors: [],
    };
  }

  //   Trip Controller Route
  @Post('/:tripId/participants')
  @HttpCode(201)
  @UseGuards(RoleGuard)
  async addParticipant(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<WebResponse<TripParticipantResponse>> {
    // Logic to add participant to trip
    const participant = await this.tripService.addParticipantToTrip(
      tripId,
      userId,
    );
    return {
      success: true,
      data: participant,
      errors: [],
    };
  }

  @Get('/:tripId/participants')
  @HttpCode(200)
  @UseGuards(RoleGuard)
  async getParticipants(
    @Param('tripId', ParseIntPipe) tripId: number,
  ): Promise<WebResponse<any[]>> {
    // Logic to get participants of a trip
    const participants = await this.tripService.getParticipantsOfTrip(tripId);
    return {
      success: true,
      data: participants,
      errors: [],
    };
  }

  @Patch('/:tripId/participants/:userId')
  @HttpCode(200)
  @UseGuards(RoleGuard)
  async updateParticipantTrip(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body('status') status: 'JOINING' | 'PENDING' | 'CANCELLED' | 'COMPLETED',
  ): Promise<WebResponse<TripParticipantResponse>> {
    // Logic to update participant status
    const participant = await this.tripService.updateParticipantTrip(
      tripId,
      userId,
      status,
    );
    return {
      success: true,
      data: participant,
      errors: [],
    };
  }

  @Delete('/:tripId/participants/:userId')
  @HttpCode(200)
  @UseGuards(RoleGuard)
  async removeParticipant(
    @Param('tripId', ParseIntPipe) tripId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<WebResponse<boolean>> {
    // Logic to remove participant from trip
    await this.tripService.removeParticipantFromTrip(tripId, userId);
    return {
      success: true,
      data: true,
      errors: [],
    };
  }
}
