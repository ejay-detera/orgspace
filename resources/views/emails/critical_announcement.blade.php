<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px 0; }
        .wrapper { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
        .header { background: #dc2626; padding: 28px 32px; }
        .header h1 { color: #fff; margin: 0; font-size: 20px; }
        .header p { color: #fecaca; margin: 4px 0 0; font-size: 13px; }
        .body { padding: 32px; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: .05em; margin-bottom: 4px; }
        .title { font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 24px; }
        .content { font-size: 15px; color: #374151; line-height: 1.7; }
        .footer { padding: 20px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
<div class="wrapper">
    <!--Temporary placeholder for critical announcements-->
    <div class="header">
        <h1>⚠ Critical Announcement</h1>
        <p>Posted by {{ $announcement->creator->name ?? 'Unknown' }}</p>
    </div>
    <div class="body">
        <div class="label">Title</div>
        <div class="title">{{ $announcement->title }}</div>
        <div class="label">Message</div>
        <div class="content">{!! $announcement->content !!}</div>
    </div>
    <div class="footer">
        This is an automated critical-priority notification. Please do not reply to this email.
    </div>
</div>
</body>
</html>
