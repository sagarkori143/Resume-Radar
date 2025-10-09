import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Resume-Mitra <onboarding@resend.dev>',
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('Email sending failed:', error)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Email sending error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Resume status change email
export async function sendResumeStatusEmail(
  userEmail: string,
  userName: string | null,
  resumeFileName: string,
  oldStatus: string,
  newStatus: string,
  score?: number,
  reviewerNotes?: string
) {
  const statusColors = {
    pending: '#f59e0b',
    approved: '#10b981',
    needs_revision: '#3b82f6',
    rejected: '#ef4444'
  }

  const statusLabels = {
    pending: 'Pending Review',
    approved: 'Approved',
    needs_revision: 'Needs Revision',
    rejected: 'Rejected'
  }

  const newStatusColor = statusColors[newStatus as keyof typeof statusColors] || '#6b7280'
  const newStatusLabel = statusLabels[newStatus as keyof typeof statusLabels] || newStatus

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume Review Update</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Resume Review Update</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #2d3748; margin-top: 0;">Hello ${userName || 'there'}!</h2>
        
        <p>Your resume <strong>"${resumeFileName}"</strong> has been reviewed and the status has been updated.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${newStatusColor};">
          <h3 style="margin-top: 0; color: ${newStatusColor};">Status: ${newStatusLabel}</h3>
          ${score ? `<p><strong>Score:</strong> ${score}/100</p>` : ''}
          ${reviewerNotes ? `<p><strong>Reviewer Notes:</strong><br>${reviewerNotes}</p>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            View Dashboard
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          If you have any questions, please don't hesitate to contact our support team.
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Resume Review Update

Hello ${userName || 'there'}!

Your resume "${resumeFileName}" has been reviewed and the status has been updated.

Status: ${newStatusLabel}
${score ? `Score: ${score}/100` : ''}
${reviewerNotes ? `Reviewer Notes: ${reviewerNotes}` : ''}

View your dashboard: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard

If you have any questions, please don't hesitate to contact our support team.
  `.trim()

  return await sendEmail({
    to: userEmail,
    subject: `Resume Review Update - ${resumeFileName}`,
    html,
    text
  })
}

// Admin request approved email
export async function sendAdminRequestApprovedEmail(
  userEmail: string,
  userName: string | null,
  adminNotes?: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Access Approved</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Admin Access Approved!</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #2d3748; margin-top: 0;">Congratulations ${userName || 'there'}!</h2>
        
        <p>Your request for admin access has been <strong>approved</strong>! You now have full access to the admin panel where you can:</p>
        
        <ul style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <li>Review and score resumes</li>
          <li>Manage user submissions</li>
          <li>View platform analytics</li>
          <li>Handle admin requests</li>
        </ul>
        
        ${adminNotes ? `
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin-top: 0; color: #10b981;">Admin Notes:</h3>
          <p>${adminNotes}</p>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" 
             style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Access Admin Panel
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Thank you for helping us maintain the quality of our platform!
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Admin Access Approved - Congratulations!

Hello ${userName || 'there'}!

Your request for admin access has been approved! You now have full access to the admin panel where you can:
- Review and score resumes
- Manage user submissions
- View platform analytics
- Handle admin requests

${adminNotes ? `Admin Notes: ${adminNotes}` : ''}

Access admin panel: ${process.env.NEXT_PUBLIC_SITE_URL}/admin

Thank you for helping us maintain the quality of our platform!
  `.trim()

  return await sendEmail({
    to: userEmail,
    subject: 'Admin Access Approved - Resume-Mitra',
    html,
    text
  })
}

// Admin request rejected email
export async function sendAdminRequestRejectedEmail(
  userEmail: string,
  userName: string | null,
  adminNotes?: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Access Request Update</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Admin Request Update</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #2d3748; margin-top: 0;">Hello ${userName || 'there'}!</h2>
        
        <p>Thank you for your interest in becoming an admin. After careful consideration, we're unable to approve your admin request at this time.</p>
        
        ${adminNotes ? `
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="margin-top: 0; color: #ef4444;">Admin Notes:</h3>
          <p>${adminNotes}</p>
        </div>
        ` : ''}
        
        <p>Don't worry! You can still use all the regular features of our platform and reapply for admin access in the future.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Continue Using Platform
          </a>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
Admin Request Update

Hello ${userName || 'there'}!

Thank you for your interest in becoming an admin. After careful consideration, we're unable to approve your admin request at this time.

${adminNotes ? `Admin Notes: ${adminNotes}` : ''}

Don't worry! You can still use all the regular features of our platform and reapply for admin access in the future.

Continue using platform: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard
  `.trim()

  return await sendEmail({
    to: userEmail,
    subject: 'Admin Access Request Update - Resume-Mitra',
    html,
    text
  })
}

// Welcome email for new users
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string | null
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Resume-Mitra</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Resume-Mitra! 🎉</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #2d3748; margin-top: 0;">Hello ${userName || 'there'}!</h2>
        
        <p>Welcome to Resume-Mitra, the professional resume review platform! We're excited to help you improve your resume and advance your career.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Get Started:</h3>
          <ol>
            <li>Upload your resume in PDF format</li>
            <li>Our expert reviewers will analyze it</li>
            <li>Receive detailed feedback and scoring</li>
            <li>Track your progress on the leaderboard</li>
          </ol>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Upload Your First Resume
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          If you have any questions, feel free to reach out to our support team.
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Welcome to Resume-Mitra!

Hello ${userName || 'there'}!

Welcome to Resume-Mitra, the professional resume review platform! We're excited to help you improve your resume and advance your career.

Get Started:
1. Upload your resume in PDF format
2. Our expert reviewers will analyze it
3. Receive detailed feedback and scoring
4. Track your progress on the leaderboard

Upload your first resume: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard

If you have any questions, feel free to reach out to our support team.
  `.trim()

  return await sendEmail({
    to: userEmail,
    subject: 'Welcome to Resume-Mitra!',
    html,
    text
  })
}
