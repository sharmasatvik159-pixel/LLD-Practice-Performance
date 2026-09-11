# -*- coding: utf-8 -*-
"""
Generate a professional, publication-quality Design Note PDF for:
- Explanation of the MVP
- User Flow
- Classes & Architecture
- Trade-offs & Design Decisions
Author: Satvik Sharma
"""

import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas for dynamic 'Page X of Y' page numbers and professional header/footer."""
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

        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 752, "LLD Practice Platform — Technical Design Note")
            self.drawRightString(558, 752, "Author: Satvik Sharma")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(54, 744, 558, 744)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 48, 558, 48)

        self.drawString(54, 34, "System Design & Low-Level Design (LLD) Platform Document")
        self.drawRightString(558, 34, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_design_note_pdf(output_filename="Design_Note.pdf"):
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

    c_primary = colors.HexColor("#0F172A")    # Deep slate
    c_accent = colors.HexColor("#2563EB")     # Royal blue
    c_muted = colors.HexColor("#475569")      # Text charcoal
    c_card_bg = colors.HexColor("#F8FAFC")    # Background light
    c_border = colors.HexColor("#E2E8F0")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=23,
        leading=27,
        textColor=c_primary,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_accent,
        spaceAfter=12
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17,
        textColor=c_primary,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_accent,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=c_muted,
        spaceAfter=6
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#1E293B")
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

    # Title & Metadata
    story.append(Paragraph("LLD Practice Platform — Design Note", title_style))
    story.append(Paragraph("System Architecture, MVP Specification, Classes, User Flow & Trade-Offs", subtitle_style))
    story.append(Paragraph("<b>Author:</b> Satvik Sharma &nbsp;|&nbsp; <b>Project:</b> LLD Practice Platform &nbsp;|&nbsp; <b>Status:</b> Completed MVP", meta_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#CBD5E1"), spaceAfter=12))

    # 1. MVP Explanation
    story.append(Paragraph("1. Explanation of the MVP (Minimum Viable Product)", h1_style))
    story.append(Paragraph(
        "The <b>LLD Practice Platform</b> addresses a widespread industry problem: software engineers preparing for Low-Level Design (LLD) "
        "and Object-Oriented Design (OOD) interviews lack an interactive workbench providing objective, standardized, and structured feedback. "
        "Unlike competitive programming, design problems do not compile into a simple binary pass/fail result. Instead, design quality rests "
        "upon class responsibilities, encapsulation, extensibility, abstraction, and edge-case handling.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Core MVP Objectives:</b><br/>"
        "• <b>Problem Discovery:</b> Present a curated library of classical OOD problems with varied difficulties (Easy to Hard).<br/>"
        "• <b>Guided Design Formulation:</b> Provide a 7-section structured input schema that trains candidates to think methodically: "
        "<i>Requirements &rarr; Assumptions &rarr; Classes &rarr; Responsibilities &rarr; Relationships &rarr; Design Decisions &rarr; Edge Cases</i>.<br/>"
        "• <b>Dual Evaluation Engine:</b> Offer both a deterministic <i>Rule-Based Evaluator</i> (for structural checks) and an <i>AI Evaluator</i> (for deeper heuristic design reasoning).<br/>"
        "• <b>Diagnostic Rubric:</b> Score solutions across 8 standardized software design criteria (1-10 each) with a normalized total score (0-100).<br/>"
        "• <b>History & Iteration:</b> Allow engineers to track past attempts and measure design improvements over time.",
        body_style
    ))

    # Highlight box
    mvp_box = [[Paragraph(
        "<b>MVP Scope Boundary:</b> The MVP delivers full end-to-end functionality (problem browsing, session state management, "
        "attempt creation, dual evaluation execution, result visualization, and attempt history) with zero third-party database dependency, "
        "enabling immediate local execution and lightweight portability.",
        callout_style
    )]]
    t_mvp = Table(mvp_box, colWidths=[504])
    t_mvp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_mvp)
    story.append(Spacer(1, 10))

    # 2. User Flow
    story.append(Paragraph("2. User Flow & State Progression", h1_style))
    story.append(Paragraph(
        "The user experience is designed to mirror a real-world technical design interview while maintaining absolute state integrity.",
        body_style
    ))

    flow_diagram = (
        "  [ Problems Catalog ]\n"
        "          |  Select problem & click 'Start Practice'\n"
        "          v\n"
        "  [ Practice Workbench ]  <-- POST /api/practice/problems/:id/attempts  (State: DRAFT)\n"
        "          |  Fill 7-field design formulation\n"
        "          |  Select Engine: [ Rule-Based Evaluator ] or [ AI Evaluator ]\n"
        "          |  Click 'Submit Design'\n"
        "          v\n"
        "  [ Evaluation Pipeline ] <-- POST /api/practice/attempts/:id/submission\n"
        "          |  Transition: DRAFT -> SUBMITTED -> EVALUATING -> COMPLETED\n"
        "          v\n"
        "  [ Results Dashboard ]   <-- Shows Overall Score /100 & 8 Detailed Feedback Cards\n"
        "          |-- Click 'Try Again'   --> Returns to new Practice attempt\n"
        "          +-- Click 'History'     --> Displays previous scores & completion dates"
    )
    t_flow = Table([[Paragraph(f"<pre>{flow_diagram}</pre>", code_style)]], colWidths=[504])
    t_flow.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_flow)
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "<b>Step-by-Step Flow Description:</b><br/>"
        "<b>1. Discovery (ProblemsPage):</b> User browses 4 challenges (<i>Parking Lot, Vending Machine, Elevator System, Library Management</i>) "
        "with difficulty tags and requirement previews.<br/>"
        "<b>2. Session Initialization (PracticePage):</b> Opening a problem issues a <code>POST</code> request creating a unique <code>Attempt</code> "
        "entity initialized to <code>DRAFT</code> status.<br/>"
        "<b>3. Design Formulation:</b> The candidate inputs details into 7 focused text areas, guided by contextual tips.<br/>"
        "<b>4. Engine Selection:</b> The user toggles between the fast <b>Rule-Based Evaluator</b> or the <b>AI Evaluator</b>.<br/>"
        "<b>5. Submission & Processing:</b> Submitting locks the attempt into <code>SUBMITTED</code>, moves to <code>EVALUATING</code>, runs the evaluator, "
        "and transitions to <code>COMPLETED</code>.<br/>"
        "<b>6. Feedback Review (ResultPage):</b> The candidate receives an overall score (/100) and 8 criterion cards with scores (/10), evidence, "
        "concerns, suggestions, and confidence levels.<br/>"
        "<b>7. Longitudinal Tracking (HistoryPage):</b> Candidates review past scores and compare previous submissions to evaluate progress.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # 3. Classes & Architecture
    story.append(Paragraph("3. Classes & Object-Oriented Architecture", h1_style))
    story.append(Paragraph(
        "The codebase follows Domain-Driven Design (DDD) with clear separation of Domain Entities, Evaluator Strategies, and Service Layers:",
        body_style
    ))

    classes_table_data = [
        [Paragraph("Class / Module", th_style), Paragraph("Layer", th_style), Paragraph("Key Attributes & Methods", th_style), Paragraph("Architectural Role", th_style)],
        [
            Paragraph("<b>Problem</b>", td_style),
            Paragraph("Domain", td_style),
            Paragraph("id, title, description, difficulty, requirements", td_style),
            Paragraph("Represents the challenge specifications and constraints.", td_style)
        ],
        [
            Paragraph("<b>Attempt</b>", td_style),
            Paragraph("Domain", td_style),
            Paragraph("id, problemId, status, submit(), evaluate(), complete()", td_style),
            Paragraph("Encapsulates the state machine lifecycle (DRAFT &rarr; COMPLETED).", td_style)
        ],
        [
            Paragraph("<b>Submission</b> (Abstract)<br/><b>TextSubmission</b>", td_style),
            Paragraph("Domain", td_style),
            Paragraph("requirements, assumptions, classes, responsibilities, relationships, decisions, edgeCases", td_style),
            Paragraph("Encapsulates candidate solution data. Extensible for diagrams/code.", td_style)
        ],
        [
            Paragraph("<b>Evaluation</b>", td_style),
            Paragraph("Domain", td_style),
            Paragraph("evaluatorType, overallScore, feedbackItems, calculateOverallScore()", td_style),
            Paragraph("Aggregates 8 criteria feedback items and computes score.", td_style)
        ],
        [
            Paragraph("<b>Feedback</b>", td_style),
            Paragraph("Domain", td_style),
            Paragraph("criterionId, score, evidence, concern, suggestion, confidence", td_style),
            Paragraph("Atomic feedback unit for a single rubric dimension.", td_style)
        ],
        [
            Paragraph("<b>Evaluator</b> (Abstract)<br/><b>RuleBasedEvaluator</b><br/><b>AIEvaluator</b>", td_style),
            Paragraph("Evaluators", td_style),
            Paragraph("getType(), evaluate({ attemptId, submission })", td_style),
            Paragraph("Strategy Pattern: concrete evaluators can be plugged in seamlessly.", td_style)
        ],
        [
            Paragraph("<b>ProblemService</b>", td_style),
            Paragraph("Service", td_style),
            Paragraph("addProblem(), getProblem(), getAllProblems()", td_style),
            Paragraph("Problem registry and catalog retrieval.", td_style)
        ],
        [
            Paragraph("<b>PracticeService</b>", td_style),
            Paragraph("Service", td_style),
            Paragraph("startAttempt(), submitAttempt(), completeAttempt(), getAttempt()", td_style),
            Paragraph("Orchestrates attempt lifecycle; relies on injected ProblemService.", td_style)
        ],
        [
            Paragraph("<b>EvaluationService</b>", td_style),
            Paragraph("Service", td_style),
            Paragraph("registerEvaluator(), evaluate(type, payload), getEvaluation()", td_style),
            Paragraph("Evaluator registry and execution dispatcher.", td_style)
        ]
    ]

    t_classes = Table(classes_table_data, colWidths=[94, 50, 180, 180])
    t_classes.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_classes)
    story.append(Spacer(1, 10))

    # 4. Trade-offs & Design Decisions
    story.append(Paragraph("4. Key Design Decisions & Architectural Trade-offs", h1_style))
    story.append(Paragraph(
        "Every production system balances technical purity against practical execution constraints. The key trade-offs made in this architecture include:",
        body_style
    ))

    tradeoffs_data = [
        [Paragraph("Architectural Decision", th_style), Paragraph("Option Chosen in MVP", th_style), Paragraph("Alternative Considered", th_style), Paragraph("Trade-off Justification", th_style)],
        [
            Paragraph("<b>Persistence Layer</b>", td_style),
            Paragraph("Thread-safe In-Memory Storage (JavaScript Maps)", td_style),
            Paragraph("PostgreSQL / MongoDB database", td_style),
            Paragraph("<b>Benefit:</b> Zero-friction setup; instant unit test execution without database seeding.<br/><b>Trade-off:</b> State does not persist across server restarts (ideal for MVP, can swap with Repository pattern later).", td_style)
        ],
        [
            Paragraph("<b>Evaluation Architecture</b>", td_style),
            Paragraph("Pluggable Strategy Pattern (Rule-Based + AI)", td_style),
            Paragraph("Direct External LLM API dependency only", td_style),
            Paragraph("<b>Benefit:</b> Works 100% offline, zero API key dependency, deterministic speed (0ms response).<br/><b>Trade-off:</b> Rule-based evaluator is heuristic; AI evaluator provides more nuanced insights.", td_style)
        ],
        [
            Paragraph("<b>Execution Model</b>", td_style),
            Paragraph("Synchronous In-Process Execution", td_style),
            Paragraph("Asynchronous Message Queue (RabbitMQ / BullMQ)", td_style),
            Paragraph("<b>Benefit:</b> Minimal operational complexity; client receives immediate feedback in a single HTTP request.<br/><b>Trade-off:</b> Long-running multi-agent evaluators will require worker queues at scale.", td_style)
        ],
        [
            Paragraph("<b>Input Structure</b>", td_style),
            Paragraph("7 Structured Domain Fields", td_style),
            Paragraph("Single Freeform Markdown Box", td_style),
            Paragraph("<b>Benefit:</b> Forces candidate to organize thoughts into LLD principles (responsibilities, relationships, patterns).<br/><b>Trade-off:</b> Slightly more rigid than a blank text document.", td_style)
        ],
        [
            Paragraph("<b>Component Decoupling</b>", td_style),
            Paragraph("Dependency Injection (DI) in Services", td_style),
            Paragraph("Global Singleton Instances", td_style),
            Paragraph("<b>Benefit:</b> Enables isolated unit testing, easy mocking of ProblemService or evaluators.<br/><b>Trade-off:</b> Requires explicit wiring in server bootloader.", td_style)
        ]
    ]

    t_tradeoffs = Table(tradeoffs_data, colWidths=[90, 110, 110, 194])
    t_tradeoffs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_accent),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tradeoffs)
    story.append(Spacer(1, 12))

    # Author signature & conclusion
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=8))
    story.append(Paragraph(
        "<b>Document Sign-off:</b><br/>"
        "This Design Note documents the complete technical specification, design patterns, and operational trade-offs "
        "implemented in the <b>LLD Practice Platform</b>. The platform successfully bridges the pedagogical gap in software engineering "
        "interviews through rigorous object-oriented architecture and deterministic evaluation.<br/>"
        "<b>Prepared by:</b> Satvik Sharma &nbsp;|&nbsp; <b>Engineering Lead & Platform Author</b>",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Design Note PDF successfully generated: {output_filename}")


if __name__ == "__main__":
    target = "Design_Note.pdf"
    if len(sys.argv) > 1:
        target = sys.argv[1]
    build_design_note_pdf(target)
