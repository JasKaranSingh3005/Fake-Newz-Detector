from src.preprocess import clean_text


def test_clean_text_lowercases():
    assert clean_text("HELLO World") == "hello world"


def test_clean_text_removes_urls():
    result = clean_text("Check this out https://example.com now")
    assert "http" not in result


def test_clean_text_removes_punctuation():
    result = clean_text("Wait, what?! Really...")
    assert "?" not in result and "!" not in result and "," not in result


def test_clean_text_handles_non_string():
    assert clean_text(None) == ""
    assert clean_text(12345) == ""


def test_clean_text_removes_html_tags():
    result = clean_text("<b>Breaking news</b>")
    assert "<" not in result and ">" not in result
