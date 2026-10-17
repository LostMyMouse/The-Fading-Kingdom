# Arrival and first equipment upgrade · 17 October 2026

## Opening

New stories begin with three short, reader-paced beats after appearance selection. A letter offers a cottage in Bramblewick, explains the overgrown paths and fading magic, and invites the player to help get things growing again. The arrival ends with the player at their cottage. The sender's identity and the cause of the fading remain open.

Each beat saves its checkpoint. Continue resumes an unfinished opening; skipping, Escape, or the close control finishes the introduction without granting or removing items. The journal can replay the letter without changing story progress. Existing chapter saves default to an already-completed arrival, so players are not interrupted or restarted.

## Earned equipment

Completing Mara's home and cooking the first batch makes a wide-spout watering-can upgrade available at Orin's cart. Sharing the food is not required. The reward has no extra material charge: the shared chapter milestone earns it. The player asks Orin in person to fit it; merely opening the equipment preview does not grant it.

The new spout waters up to three planted plots horizontally in one action. Aim at the middle of a full row for three plots; an edge can cover two. Only planted, unripe crops in range are watered. No seeds or crops are consumed by area watering. Tapping a ripe target still harvests it, as before. Coverage is outlined with water-drop markers, and feedback reports the number watered. Touch, pointer and keyboard use the same rule.

The toolbar icon and selection text reflect the earned upgrade. The equipment page distinguishes the starting can, an available/earned wide-spout can, and future carry baskets, soil tools and irrigation. Future tools are explicitly later-chapter previews, not functioning unlocks in this build.

A later ownership incident does not remove an earned tool. If the player has Orin's boards when first asking for his help fitting the spout, that relevant work waits for their return. Farming remains available. Completed older saves can earn the upgrade immediately from Orin after loading.

## Compatibility and verification

The version-two save key remains unchanged. Missing arrival and upgrade fields migrate to completed/unequipped respectively, with all existing progress preserved; present invalid field values are rejected. New saves record both fields.

The suite now has 37 passing checks: 29 previous regressions and eight for arrival checkpoints/skipping, migration, milestone eligibility, one-time in-person equipment fitting, basic versus three-plot watering, safe edge/ripe/empty handling, permanence through reload/disagreement/day advance, and invalid new state/future-preview labelling. New runtime modules pass syntax checks.

The dialogue-close handler also avoids cancelling a new walk started by a dialogue choice. The first equipment handover uses that path to guide the player toward the garden.

Live browser observations are recorded after the release is exercised. Real touch hardware and child playtesting remain separate checks.
