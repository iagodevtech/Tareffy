import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verifique seu email - Tareffy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Bem-vindo ao Tareffy!</h2>
          <p>Obrigado por se cadastrar. Para ativar sua conta, clique no link abaixo:</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Verificar Email
          </a>
          <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; color: #6B7280;">${verificationUrl}</p>
          <p>Este link expira em 24 horas.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">
            Se você não se cadastrou no Tareffy, ignore este email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Redefinir Senha - Tareffy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Redefinir Senha</h2>
          <p>Você solicitou a redefinição da sua senha. Clique no link abaixo para criar uma nova senha:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Redefinir Senha
          </a>
          <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
          <p style="word-break: break-all; color: #6B7280;">${resetUrl}</p>
          <p>Este link expira em 1 hora.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">
            Se você não solicitou a redefinição de senha, ignore este email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send task assignment notification
export const sendTaskAssignmentEmail = async (email: string, taskTitle: string, projectName: string) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Nova Tarefa Atribuída - Tareffy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Nova Tarefa Atribuída</h2>
          <p>Uma nova tarefa foi atribuída a você:</p>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">${taskTitle}</h3>
            <p style="margin: 0; color: #6B7280;">Projeto: ${projectName}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/tasks" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Ver Tarefa
          </a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Task assignment email sent to ${email}`);
  } catch (error) {
    console.error('Error sending task assignment email:', error);
    throw error;
  }
};

// Send project invitation email
export const sendProjectInvitationEmail = async (email: string, projectName: string, inviterName: string) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Convite para Projeto - Tareffy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Convite para Projeto</h2>
          <p>${inviterName} convidou você para participar do projeto:</p>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0;">${projectName}</h3>
          </div>
          <a href="${process.env.FRONTEND_URL}/projects" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Ver Projeto
          </a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Project invitation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending project invitation email:', error);
    throw error;
  }
};
