import { NextResponse } from 'next/server'
import { createUserGoogleServices } from '@/lib/user-auth'
import { GaxiosError } from 'gaxios'

/**
 * Test Google Drive and Slides API access for the authenticated user
 * Based on Google APIs documentation for authentication and file operations
 */
export async function GET() {
  try {
    console.log('🧪 Testing Google Slides presentation access...')

    // Get authenticated user services
    const { slides, drive } = await createUserGoogleServices()

    // Test presentation ID from user
    const testPresentationId = '1h4FhJxXgsrZ71wArJf5WjKWZB1lV98iYfn_CJ2pYMD8'

    console.log('📄 Testing access to presentation:', testPresentationId)

    // Test 1: Check if we can read the presentation
    const presentation = await slides.presentations.get({
      presentationId: testPresentationId
    })

    console.log('✅ Presentation access successful:', presentation.data.title)
    console.log('📊 Slides count:', presentation.data.slides?.length || 0)

    // Test 2: Try to copy the presentation (to user's root drive)
    const copyResult = await drive.files.copy({
      fileId: testPresentationId,
      requestBody: {
        name: 'Test Copy - AI Slides Generator'
        // No parents = copy to user's root My Drive
      }
    })

    console.log('✅ Presentation copied successfully:', copyResult.data.id)

    // Test 3: Verify we can modify the copied presentation
    if (copyResult.data.id) {
      const testRequests = [{
        insertText: {
          objectId: presentation.data.slides?.[0]?.objectId,
          text: 'Test modification',
          insertionIndex: 0
        }
      }]

      await slides.presentations.batchUpdate({
        presentationId: copyResult.data.id,
        requestBody: { requests: testRequests }
      })

      console.log('✅ Presentation modification successful')
    }

    // Clean up - delete test copy
    if (copyResult.data.id) {
      await drive.files.delete({
        fileId: copyResult.data.id
      })
      console.log('🗑️ Test copy deleted')
    }

    return NextResponse.json({
      success: true,
      message: 'Google Slides API access is working correctly',
      details: {
        presentationId: testPresentationId,
        title: presentation.data.title,
        slidesCount: presentation.data.slides?.length || 0,
        copySuccessful: true
      }
    })

  } catch (error) {
    console.error('❌ Google Slides presentation access test failed:', error)

    // Handle specific Google API errors
    if (error instanceof GaxiosError) {
      const statusCode = error.status || 500

      if (statusCode === 403) {
        return NextResponse.json({
          success: false,
          message: 'Access denied. Please check your Google Drive permissions.',
          error: 'PERMISSION_DENIED',
          details: error.message
        }, { status: 403 })
      }

      if (statusCode === 404) {
        return NextResponse.json({
          success: false,
          message: 'Presentation not found. Please check the presentation ID.',
          error: 'NOT_FOUND',
          details: error.message
        }, { status: 404 })
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Google Slides API test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  }
}