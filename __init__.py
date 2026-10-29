# SPDX-FileCopyrightText: 2026 Miguel Euraque
# SPDX-License-Identifier: MIT

"""Hermes Agent compatibility entrypoint for the Desktop-only Nous Girl theme.

The visual contribution is registered by ``desktop/plugin.js`` in Hermes
Desktop. Hermes Agent imports every installed plugin directory through this
module; keeping the entrypoint intentionally inert satisfies that contract
without exposing UI-only behavior as Agent tools, hooks or settings.
"""


def register(ctx):
    """Satisfy Hermes Agent's plugin contract without registering capabilities."""
    del ctx
