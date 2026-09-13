"""python3 -m unittest extensions/general/upper-hand/scripts/test_model_client.py (from the Accounted root)."""
import unittest
import model_client as mc


class Resolve(unittest.TestCase):
    def test_defaults_keep_hackathon_models(self):
        self.assertEqual(mc.resolve("analysis", {}), "qwen3.6:35b-a3b")
        self.assertEqual(mc.resolve("control", {}), "gemma4:31b")

    def test_legacy_env_still_works(self):
        self.assertEqual(mc.resolve("analysis", {"MODEL": "x"}), "x")
        self.assertEqual(mc.resolve("control", {"CONTROL_MODEL": "y"}), "y")

    def test_route_env_wins_over_legacy(self):
        self.assertEqual(mc.resolve("analysis", {"MODEL": "x", "HDNG_ROUTE_ANALYSIS": "mistral-small"}), "mistral-small")

    def test_new_route_class_needs_env(self):
        self.assertEqual(mc.resolve("draft", {"HDNG_ROUTE_DRAFT": "m"}), "m")
        with self.assertRaises(KeyError):
            mc.resolve("draft", {})


class Gateway(unittest.TestCase):
    def test_default_gateway_and_label(self):
        self.assertEqual(mc.gateway_url({}), "https://api.staik.se/v1")
        self.assertEqual(mc.provider_label({}), "Staik · SE")

    def test_gateway_override_strips_slash(self):
        self.assertEqual(mc.gateway_url({"HDNG_MODEL_GATEWAY_URL": "https://core.example/models/"}), "https://core.example/models")

    def test_token_prefers_app_token(self):
        self.assertEqual(mc.token({"HDNG_APP_TOKEN": "a", "STAIK_API_KEY": "s"}), "a")
        self.assertEqual(mc.token({"STAIK_API_KEY": "s"}), "s")
        with self.assertRaises(RuntimeError):
            mc.token({})

    def test_describe(self):
        d = mc.describe({"HDNG_PROVIDER_LABEL": "HDNG Core"})
        self.assertEqual(d["provider"], "HDNG Core")
        self.assertEqual(set(d["routes"]), {"analysis", "control"})


class Usage(unittest.TestCase):
    def test_event_shape(self):
        ev = mc.usage_event("analysis", "m", {"usage": {"prompt_tokens": 10, "completion_tokens": 5}}, 1234.9, env={"UH_RUN_ID": "r1"})
        self.assertEqual(ev["app_id"], "hdng.upper-hand")
        self.assertEqual((ev["route_class"], ev["model"], ev["run_id"]), ("analysis", "m", "r1"))
        self.assertEqual((ev["prompt_tokens"], ev["completion_tokens"], ev["duration_ms"]), (10, 5, 1234))
        self.assertEqual(ev["kind"], "model")


if __name__ == "__main__":
    unittest.main()
