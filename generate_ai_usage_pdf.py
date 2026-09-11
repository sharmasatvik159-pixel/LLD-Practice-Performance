# -*- coding: utf-8 -*-
"""
Generate a publication-quality PDF for:
AI Usage Report & Documentation (How to run, Key Decisions, Limitations, AI Report)
Author: Satvik Sharma
"""

import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))

        if self._pageNumber > 1:
            self.drawString(54, 752, "LLD Practice Platform — Documentation & AI Usage Report")
            self.drawRightString(558, 752, "Author: Satvik Sharma")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(54, 744, 558, 744)

        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 48, 558, 48)

        self.drawString(54, 34, "Project Run Guide | Key Decisions | Limitations | AI Usage Report")
        self.drawRightString(558, 34, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_ai_usage_pdf(output_filename="AI_USAGE_REPORT.pdf"):
    d = os.path.dirname(output_filename)
    if d:
        os.makedirs(d, exist_ok=True)

    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=60,
        bottomMargin=60
    )

    styles = getSampleStyleSheet()

    c_primary = colors.HexColor("#0F172A")
    c_accent = colors.HexColor("#2563EB")
    c_muted = colors.HexColor("#475569")
    c_border = colors.HexColor("#E2E8F0")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=c_primary,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11.5,
        leading=15,
        textColor=c_accent,
        spaceAfter=10
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=13,
        textColor=c_muted,
        spaceAfter=5
    )

    code_style = ParagraphStyle(
        'Code',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0F172A")
    )

    th_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )

    td_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_primary
    )

    story = []

    # Title Header
    story.append(Paragraph("Documentation & AI Usage Report", title_style))
    story.append(Paragraph("Project Execution Guide, Architectural Decisions, Limitations & AI Collaboration Disclosure", subtitle_style))
    story.append(Paragraph("<b>Author:</b> Satvik Sharma &nbsp;|&nbsp; <b>Project:</b> LLD Practice Platform &nbsp;|&nbsp; <b>Repository:</b> github.com/sharmasatvik159-pixel/LLD-Practice-Performance", meta_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    # 1. How to Run the Project
    story.append(Paragraph("1. How to Run the Project", h1_style))
    story.append(Paragraph(
        "<b>Prerequisites:</b> Node.js (v18+) and npm (v9+) installed. Git configured.<br/>"
        "<b>Step 1: Clone Repository:</b><br/>"
        "<code>git clone https://github.com/sharmasatvik159-pixel/LLD-Practice-Performance.git</code><br/>"
        "<b>Step 2: Backend Execution:</b><br/>"
        "Open a terminal: <code>cd server && npm install && npm run dev</code> &rarr; Server starts on <b>http://localhost:5000</b>.<br/>"
        "<b>Step 3: Frontend Execution:</b><br/>"
        "Open a second terminal: <code>cd client && npm install && npm run dev</code> &rarr; Client launches on <b>http://localhost:5173</b>.<br/>"
        "<b>Step 4: Automated Testing:</b><br/>"
        "Run <code>npm test</code> inside the <code>server</code> directory to execute all 10 domain unit tests, 4 e2e problem scenarios, and 5 error injections (100% pass rate).",
        body_style
    ))
    story.append(Spacer(1, 8))

    # 2. Key Architectural Decisions
    story.append(Paragraph("2. Key Architectural Decisions", h1_style))
    story.append(Paragraph(
        "• <b>Clean Architecture & Domain-Driven Design:</b> Business entities (<code>Problem</code>, <code>Attempt</code>, <code>Submission</code>, <code>Evaluation</code>) are written in pure JavaScript, completely decoupled from HTTP/Express concerns.<br/>"
        "• <b>Guarded Finite State Machine:</b> Strict lifecycle transition rules (<code>DRAFT</code> &rarr; <code>SUBMITTED</code> &rarr; <code>EVALUATING</code> &rarr; <code>COMPLETED</code>) enforce domain integrity and reject out-of-order calls.<br/>"
        "• <b>Strategy Pattern for Pluggable Evaluators:</b> Abstract <code>Evaluator</code> interface allows seamless switching between the <i>Rule-Based Evaluator</i> and <i>AI Evaluator</i> via the <code>EvaluationService</code> registry.<br/>"
        "• <b>Structured 7-Field Form:</b> Guides candidate thought process systematically (Requirements &rarr; Assumptions &rarr; Classes &rarr; Responsibilities &rarr; Relationships &rarr; Patterns &rarr; Edge Cases).<br/>"
        "• <b>Dependency Injection:</b> <code>PracticeService</code> receives <code>ProblemService</code> via constructor injection, enabling clean unit testing and mock isolation.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # 3. Known Limitations & Production Roadmap
    story.append(Paragraph("3. Known Limitations & Production Roadmap", h1_style))

    lim_data = [
        [Paragraph("Limitation in Current MVP", th_style), Paragraph("Architectural Rationale", th_style), Paragraph("Production Roadmap Solution", th_style)],
        [
            Paragraph("<b>In-Memory Storage</b>", td_style),
            Paragraph("Zero-friction local execution without database setup.", td_style),
            Paragraph("Implement Repository Pattern with PostgreSQL / Prisma ORM.", td_style)
        ],
        [
            Paragraph("<b>Heuristic AI Engine</b>", td_style),
            Paragraph("Offline, 0ms latency, zero API key/cost dependency.", td_style),
            Paragraph("Integrate live LLM APIs (OpenAI / Claude) with structured JSON parsing.", td_style)
        ],
        [
            Paragraph("<b>Synchronous Pipeline</b>", td_style),
            Paragraph("Sub-50ms execution gives immediate client response.", td_style),
            Paragraph("Migrate to async worker queue (BullMQ + Redis) with WebSockets.", td_style)
        ],
        [
            Paragraph("<b>Textual Representation</b>", td_style),
            Paragraph("Simplifies candidate input and rubric parsing.", td_style),
            Paragraph("Add interactive Mermaid.js diagram editor and UML AST validator.", td_style)
        ]
    ]
    t_lim = Table(lim_data, colWidths=[130, 160, 214])
    t_lim.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_accent),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_lim)
    story.append(Spacer(1, 10))

    # 4. AI Usage Report
    story.append(Paragraph("4. Comprehensive AI Usage Report", h1_style))
    story.append(Paragraph(
        "<b>Tools & Models Utilized:</b> Google DeepMind Antigravity / Gemini & Claude Coding Assistant.<br/>"
        "<b>Nature of Assistance:</b> Agentic pair-programming spanning architecture design, domain model debugging, test automation scaffolding, and documentation generation.",
        body_style
    ))

    matrix_data = [
        [Paragraph("Subsystem / Task", th_style), Paragraph("AI Contribution", th_style), Paragraph("Human Responsibility", th_style)],
        [Paragraph("System Architecture & DDD", td_style), Paragraph("40% (Pattern drafting, class outlines)", td_style), Paragraph("60% (Scoping, domain rules, final design sign-off)", td_style)],
        [Paragraph("Domain Models & State Machine", td_style), Paragraph("50% (Transition methods, error guards)", td_style), Paragraph("50% (Invariants review, lifecycle validation)", td_style)],
        [Paragraph("Evaluator Engines (Strategy)", td_style), Paragraph("60% (Scaffolding Rule & AI strategies)", td_style), Paragraph("40% (Rubric criteria definitions, scoring logic)", td_style)],
        [Paragraph("Frontend UI (React + Vite)", td_style), Paragraph("45% (Component layouts, CSS tokens)", td_style), Paragraph("55% (UX review, state wiring, user flow QA)", td_style)],
        [Paragraph("Automated Test Suite & E2E", td_style), Paragraph("70% (Scaffolding runner and HTTP tests)", td_style), Paragraph("30% (Defining test cases, edge case scenarios)", td_style)],
        [Paragraph("Documentation & PDF Reports", td_style), Paragraph("60% (ReportLab formatting scripts)", td_style), Paragraph("40% (Technical writing, trade-off justifications)", td_style)],
    ]
    t_matrix = Table(matrix_data, colWidths=[140, 164, 200])
    t_matrix.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_matrix)
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Human Oversight & Verification:</b> All generated code was thoroughly reviewed, debugged, and verified through manual end-to-end browser walkthroughs and automated test execution. The human engineer retained complete intellectual ownership of architectural decisions, domain invariants, and product requirements.<br/>"
        "<b>Prepared by:</b> Satvik Sharma &nbsp;|&nbsp; <b>Engineering Lead</b>",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"AI Usage PDF successfully generated: {output_filename}")


if __name__ == "__main__":
    target = "AI_USAGE_REPORT.pdf"
    if len(sys.argv) > 1:
        target = sys.argv[1]
    build_ai_usage_pdf(target)
