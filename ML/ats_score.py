def calculate_general_ats_score(resume_entities):
    """
    General ATS Score independent of Job Description.
    Detects empty fields from NER output and scores accordingly.
    """

    score = 0
    max_score = 100

    # ---- Completeness ----
    required_sections = ["Name", "Email", "Skills", "College", "Companies"]
    missing_fields = [sec for sec in required_sections if not resume_entities.get(sec)]
    completeness = (len(required_sections) - len(missing_fields)) / len(required_sections)
    score += completeness * 30  # 30% weight

    # ---- Skills richness ----
    skills = resume_entities.get("Skills", [])
    num_skills = len(set(skills))
    if num_skills >= 10:
        score += 25
    elif num_skills >= 5:
        score += 15
    elif num_skills > 0:
        score += 5
    else:
        missing_fields.append("Skills")

    # ---- Experience ----
    companies = resume_entities.get("Companies", [])
    if len(companies) >= 3:
        score += 20
    elif len(companies) >= 1:
        score += 10
    else:
        missing_fields.append("Companies")

    # ---- Education ----
    colleges = resume_entities.get("College", [])
    if colleges:
        score += 10
    else:
        missing_fields.append("College")

    # ---- Contact Info ----
    email = resume_entities.get("Email", [])
    if email:
        score += 5
    else:
        missing_fields.append("Email")

    location = resume_entities.get("Location", [])
    if location:
        score += 5
    else:
        missing_fields.append("Location")

    return {
        "ats_score": round(min(score, max_score), 2),
        "completeness": round(completeness * 100, 2),
        "skills_count": num_skills,
        "companies_count": len(companies),
        "education_present": bool(colleges),
        "contact_info": {
            "email_present": bool(email),
            "location_present": bool(location)
        },
        "missing_fields": list(set(missing_fields))  # unique missing fields
    }
