"""
Unit tests for pure-logic helper functions in server.py.

These tests do not require a database connection or external API keys.
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from server import determine_environment


class TestDetermineEnvironment:
    """Verify that every recognised emotion maps to the correct environment."""

    @pytest.mark.parametrize("emotion", ["happy", "neutral"])
    def test_calm_environment(self, emotion):
        assert determine_environment(emotion) == "calm"

    @pytest.mark.parametrize("emotion", ["sad", "fearful"])
    def test_comfort_environment(self, emotion):
        assert determine_environment(emotion) == "comfort"

    def test_energy_environment(self):
        assert determine_environment("surprised") == "energy"

    def test_focus_environment(self):
        assert determine_environment("angry") == "focus"

    @pytest.mark.parametrize("emotion", ["disgusted", "confused", "unknown", "", "😢"])
    def test_unknown_emotion_defaults_to_calm(self, emotion):
        assert determine_environment(emotion) == "calm"

    def test_case_sensitivity(self):
        # The function is case-sensitive; 'Happy' is not in the recognised set
        # and therefore falls through to the default "calm" environment.
        assert determine_environment("Happy") == "calm"
        assert determine_environment("Sad") == "calm"
        assert determine_environment("ANGRY") == "calm"

    def test_returns_string(self):
        result = determine_environment("happy")
        assert isinstance(result, str)
