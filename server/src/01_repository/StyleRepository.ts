/**
 * StyleRepository
 * 
 * ロールの基本情報：
 *  style_id:   number
 *  style:      string  max: 32
 *  updatedAt:  Date
 */

import { PrismaClient } from "@prisma/client"
import { RepositoryError } from "./RepositoryError"
import { Failure, Result, Success } from "../type"


type StyleType = {
  style_id:   number,
  style:      string,
  updatedAt:  Date,
}


export interface IStyleRepository {
  // find
  findById: (style_id: number)
    => Promise<Result<StyleType, RepositoryError>>
  findByStyle: (style: string)
    => Promise<Result<StyleType, RepositoryError>>
  
  // get list
  getStyleList: (skip: number, take: number) 
    => Promise<Result<StyleType[], RepositoryError>>
  
  // upsert
  createStyle: (style: string)
    => Promise<Result<StyleType, RepositoryError>>
  
  // delete
  deleteStyle: (style_id: number)
    => Promise<Result<StyleType, RepositoryError>>
}

export class StyleRepository implements IStyleRepository {
  constructor(
    private prisma: PrismaClient
  ){}

  findById = async (
    style_id: number
  ) :Promise<Result<StyleType, RepositoryError>> => {
    const style_or_error = await ( async() => {
      try {
        return await this.prisma.style.findUnique({
          where: { style_id: style_id },
          select: {
            style_id:   true,
            style:      true,
            updatedAt:  true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()  
  
    if ( style_or_error instanceof Failure ){
      return style_or_error
    }
    if ( style_or_error === null ) {
      return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
    }

    return new Success<StyleType>(style_or_error)
  }

  findByStyle = async (
    style: string
  ) :Promise<Result<StyleType, RepositoryError>> => {
    const style_or_error = await ( async() => {
      try {
        return await this.prisma.style.findUnique({
          where: { style: style },
          select: {
            style_id:   true,
            style:      true,
            updatedAt:  true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()  
  
      if ( style_or_error instanceof Failure ){
        return style_or_error
      }
      if ( style_or_error === null ) {
        return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
      }
  
      return new Success<StyleType>(style_or_error)
  }

  getStyleList = async (
    skip: number,
    take: number
  ) :Promise<Result<StyleType[], RepositoryError>> => {
    const styles_or_error = await ( async() => {
      try {
        return await this.prisma.style.findMany({
          skip: skip,
          take: take,
          select: {
            style_id:   true,
            style:      true,
            updatedAt:  true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()  
  
      if ( styles_or_error instanceof Failure ){
        return styles_or_error
      }
  
      return new Success<StyleType[]>(styles_or_error)
  }

  createStyle = async (
    style: string
  ) :Promise<Result<StyleType, RepositoryError>> => {
    const style_or_error = await ( async() => {
      try {
        return await this.prisma.style.create({
          data: {
            style: style,
          },
          select: {
            style_id:   true,
            style:      true,
            updatedAt:  true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()  
  
    if ( style_or_error instanceof Failure ){
      return style_or_error
    }

    return new Success<StyleType>(style_or_error)
  }

  deleteStyle = async (
    style_id: number
  ) :Promise<Result<StyleType, RepositoryError>> => {
    const style_or_error = await ( async() => {
      try {
        return await this.prisma.style.delete({
          where: { style_id: style_id },
          select: {
            style_id:   true,
            style:      true,
            updatedAt:  true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()  
  
    if ( style_or_error instanceof Failure ){
      return style_or_error
    }

    return new Success<StyleType>(style_or_error)
  }
}