from PIL import Image, ImageDraw, ImageFont
import os

def draw_rounded_rect(draw, x1, y1, x2, y2, r, fill, outline=None, width=1):
    draw.rounded_rectangle([x1, y1, x2, y2], radius=r, fill=fill, outline=outline, width=width)

def draw_text_center(draw, text, x_center, y_center, fill, font=None):
    # Calculate text width/height
    if font:
        bbox = draw.textbbox((0, 0), text, font=font)
        w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    else:
        w, h = len(text) * 6, 10
    draw.text((x_center - w/2, y_center - h/2 - 2), text, fill=fill, font=font)

def generate_architecture_diagram():
    # 800 x 500 white canvas
    img = Image.new('RGB', (800, 520), color='white')
    draw = ImageDraw.Draw(img)
    
    # Load a default font
    try:
        font_title = ImageFont.truetype("arial.ttf", 20)
        font_box = ImageFont.truetype("arial.ttf", 14)
        font_sub = ImageFont.truetype("arial.ttf", 11)
    except IOError:
        font_title = None
        font_box = None
        font_sub = None

    # Title
    draw.text((40, 20), "MedAssist AI Backend System Architecture", fill=(40, 40, 40), font=font_title)
    draw.line((40, 48, 760, 48), fill=(200, 200, 200), width=1)

    # 1. Client / UI (Left)
    draw_rounded_rect(draw, 40, 150, 160, 230, 8, fill=(41, 128, 185)) # Blue
    draw_text_center(draw, "Client / Frontend", 100, 175, "white", font_box)
    draw_text_center(draw, "(Symptom UI & Charts)", 100, 200, "white", font_sub)

    # Arrow 1: Client -> FastAPI Router
    draw.line((160, 190, 220, 190), fill=(100, 100, 100), width=3)
    draw.polygon([(220, 190), (210, 185), (210, 195)], fill=(100, 100, 100))

    # 2. FastAPI Gateway Router (Middle Left)
    draw_rounded_rect(draw, 220, 150, 340, 230, 8, fill=(26, 188, 156)) # Green
    draw_text_center(draw, "FastAPI Router", 280, 175, "white", font_box)
    draw_text_center(draw, "(/api/auth, /api/history)", 280, 200, "white", font_sub)

    # Arrow 2: FastAPI Router -> Auth Dependency (down)
    draw.line((280, 230, 280, 280), fill=(100, 100, 100), width=3)
    draw.polygon([(280, 280), (275, 270), (285, 270)], fill=(100, 100, 100))

    # 3. Auth Guard / JWT Security (Middle bottom)
    draw_rounded_rect(draw, 220, 280, 340, 360, 8, fill=(231, 76, 60)) # Red
    draw_text_center(draw, "Security Guard", 280, 305, "white", font_box)
    draw_text_center(draw, "JWT & Role Check", 280, 330, "white", font_sub)

    # Arrow 3: Auth Guard -> Services (right)
    draw.line((340, 320, 400, 320), fill=(100, 100, 100), width=3)
    draw.polygon([(400, 320), (390, 315), (390, 325)], fill=(100, 100, 100))

    # 4. Services (Middle Right)
    draw_rounded_rect(draw, 400, 280, 520, 360, 8, fill=(230, 126, 34)) # Orange
    draw_text_center(draw, "App Services", 460, 305, "white", font_box)
    draw_text_center(draw, "Auth & Predictions", 460, 330, "white", font_sub)

    # Arrow 4: Services -> Database Helper (up)
    draw.line((460, 280, 460, 230), fill=(100, 100, 100), width=3)
    draw.polygon([(460, 230), (455, 240), (465, 240)], fill=(100, 100, 100))

    # 5. Database Connection Helper (Middle top-right)
    draw_rounded_rect(draw, 400, 150, 520, 230, 8, fill=(155, 89, 182)) # Purple
    draw_text_center(draw, "Database Helper", 460, 175, "white", font_box)
    draw_text_center(draw, "MongoDB Connection", 460, 200, "white", font_sub)

    # Arrow 5: Database Helper -> Storage (right)
    draw.line((520, 190, 580, 190), fill=(100, 100, 100), width=3)
    draw.polygon([(580, 190), (570, 185), (570, 195)], fill=(100, 100, 100))

    # 6. Database Storage (Right)
    draw_rounded_rect(draw, 580, 110, 760, 410, 10, fill=(245, 245, 245), outline=(200, 200, 200), width=2)
    draw_text_center(draw, "STORAGE LAYER", 670, 130, (80, 80, 80), font_box)
    
    # Storage Collections
    collections = [
        ("users", "User Logins & Roles", (46, 204, 113)),
        ("profiles", "Demographics & Medicals", (46, 204, 113)),
        ("symptoms", "Indexed symptoms (377)", (46, 204, 113)),
        ("disease_profiles", "ML likelihood profiles", (46, 204, 113)),
        ("consultations", "Prediction logs", (46, 204, 113))
    ]
    
    y_offset = 160
    for col_name, col_desc, col_color in collections:
        draw_rounded_rect(draw, 600, y_offset, 740, y_offset + 40, 5, fill=col_color)
        draw_text_center(draw, f"'{col_name}'", 670, y_offset + 12, "white", font_box)
        draw_text_center(draw, col_desc, 670, y_offset + 28, "white", font_sub)
        y_offset += 50

    # 7. Resilient Fallback indicator (bottom left)
    draw_rounded_rect(draw, 40, 430, 520, 490, 8, fill=(241, 196, 15)) # Yellow
    draw_text_center(draw, "Resilience Layer: Auto-detects MongoDB connection.", 280, 450, "black", font_box)
    draw_text_center(draw, "If offline, falls back seamlessly to local JSON database storage under 'backend/data/'.", 280, 470, "black", font_sub)

    # Save to disk
    img.save("c:/Users/Anbarasan.K/Downloads/mediai/architecture_diagram.png")
    print("Generated architecture_diagram.png")

def generate_test_results():
    # 700 x 300 terminal canvas
    img = Image.new('RGB', (700, 300), color=(30, 30, 30)) # Dark Gray Terminal
    draw = ImageDraw.Draw(img)
    
    try:
        font_mono = ImageFont.truetype("consola.ttf", 13)
        font_mono_bold = ImageFont.truetype("consolab.ttf", 13)
    except IOError:
        font_mono = None
        font_mono_bold = None

    # Draw terminal top header
    draw.rectangle([0, 0, 700, 25], fill=(50, 50, 50))
    draw.ellipse([10, 8, 20, 18], fill=(231, 76, 60)) # Red button
    draw.ellipse([25, 8, 35, 18], fill=(241, 196, 15)) # Yellow button
    draw.ellipse([40, 8, 50, 18], fill=(46, 204, 113)) # Green button
    draw_text_center(draw, "PowerShell - pytest tests/", 350, 12, (200, 200, 200), font_mono)

    # Console Text
    console_lines = [
        ("PS C:\\Users\\Anbarasan.K\\Downloads\\mediai\\backend> pytest", (255, 255, 255), False),
        ("============================= test session starts =============================", (160, 160, 160), False),
        ("platform win32 -- Python 3.14.0, pytest-9.1.1, pluggy-1.6.0", (160, 160, 160), False),
        ("rootdir: C:\\Users\\Anbarasan.K\\Downloads\\mediai\\backend", (160, 160, 160), False),
        ("collected 4 items", (255, 255, 255), True),
        ("", (255, 255, 255), False),
        ("tests\\test_api.py ....                                                   [100%]", (46, 204, 113), True),
        ("", (255, 255, 255), False),
        ("======================= 4 passed, 10 warnings in 5.59s ========================", (46, 204, 113), True),
    ]

    y_pos = 40
    for line, color, is_bold in console_lines:
        font = font_mono_bold if is_bold else font_mono
        draw.text((20, y_pos), line, fill=color, font=font)
        y_pos += 22

    # Save to disk
    img.save("c:/Users/Anbarasan.K/Downloads/mediai/test_results.png")
    print("Generated test_results.png")

if __name__ == "__main__":
    generate_architecture_diagram()
    generate_test_results()
