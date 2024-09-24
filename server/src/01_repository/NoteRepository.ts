/**
 * NoteRepository
 * 
 * noteの基本情報
 *  note_id:      string
 *  user_id:      string
 *  note_title:   string  max: 64
 *  content:      string  max: たくさん.
 *  style_id:     number
 *  updatedAt:    Date
 */

import { Failure, Result, Success } from "@/type"
import { RepositoryError } from "./RepositoryError"
import { Note, PrismaClient } from "@prisma/client"

export type NoteType = {
  note_id:      string,
  user_id:      string,
  note_title:   string,
  content:      string,
  style_id:     number,
  updatedAt:    Date,
}

type UpsertNoteType = {
  note_id:      string,
  user_id:      string,
  note_title:   string,
  content:      string,
  style_id:     number,
}

export interface INoteRepository {
  // find
  findById: (note_id: string)
    => Promise<Result<NoteType, RepositoryError>>
  
  // get list by user_id
  getNoteList: (user_id: string, skip: number, take: number)
    => Promise<Result<NoteType[], RepositoryError>>
  
  // upsert
  upsertNote: ({ note_id, user_id, note_title, content, style_id }: UpsertNoteType)
    => Promise<Result<NoteType, RepositoryError>>
  
  // delete
  deleteNote: (note_id: string)
    => Promise<Result<NoteType, RepositoryError>>
}

export class NoteRepository implements INoteRepository {
  constructor(
    private readonly prisma: PrismaClient
  ){}

  findById = async (
    note_id: string
  ) :Promise<Result<NoteType, RepositoryError>> => {
    const note_or_error = await ( async() => {
      try {
        return await this.prisma.note.findUnique({
          where: { note_id: note_id }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( note_or_error instanceof Failure ){
      return note_or_error
    }
    if ( note_or_error === null ) {
      return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
    }
    
    return new Success<NoteType>(note_or_error)
  }

  getNoteList = async (
    user_id:  string,
    skip:     number,
    take:     number,
  ) :Promise<Result<NoteType[], RepositoryError>> => {
    const note_list_or_error = await ( async() => {
      try {
        return await this.prisma.note.findMany({
          skip: skip,
          take: take,
          where: { user_id: user_id }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( note_list_or_error instanceof Failure ){
      return note_list_or_error
    }
    
    return new Success<NoteType[]>(note_list_or_error)
  }

  upsertNote = async ({ 
    note_id,
    user_id,
    note_title,
    content,
    style_id,
  }: UpsertNoteType) :Promise<Result<NoteType, RepositoryError>> => {
    const note_or_error = await ( async() => {
      try {
        return await this.prisma.note.upsert({
          where: { note_id: note_id },
          create: {
            note_id:      note_id,
            user_id:      user_id,
            note_title:   note_title,
            content:      content,
            style_id:     style_id,
          },
          update: {
            note_title:   note_title,
            content:      content,
            style_id:     style_id,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( note_or_error instanceof Failure ){
      return note_or_error
    }

    return new Success<NoteType>(note_or_error)
  }

  deleteNote = async (
    note_id: string
  ) :Promise<Result<NoteType, RepositoryError>> => {
    const note_or_error = await ( async() => {
      try {
        return await this.prisma.note.delete({
          where: { note_id: note_id }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( note_or_error instanceof Failure ){
      return note_or_error
    }
    
    return new Success<NoteType>(note_or_error)
  }
}