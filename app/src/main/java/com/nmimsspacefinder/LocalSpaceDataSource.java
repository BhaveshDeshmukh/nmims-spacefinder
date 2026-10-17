package com.nmimsspacefinder;

import java.util.ArrayList;
import java.util.List;

/**
 * Data bundled in the app. These locations are the ones confirmed by the
 * project team. Every other room has no location (null), not a guess.
 */
public class LocalSpaceDataSource implements SpaceDataSource {

    @Override
    public List<Space> loadSpaces() {
        List<Space> list = new ArrayList<>();

        // ----- Classrooms with confirmed locations -----
        list.add(lecture(1, Space.Wing.B, Space.Floor.GROUND, Space.Side.LEFT));
        list.add(lecture(3, Space.Wing.B, Space.Floor.GROUND, Space.Side.RIGHT));
        list.add(lecture(10, Space.Wing.B, Space.Floor.SECOND, Space.Side.RIGHT));
        list.add(lecture(13, Space.Wing.C, Space.Floor.FIRST, Space.Side.LEFT));
        list.add(lecture(17, Space.Wing.C, Space.Floor.FIRST, Space.Side.RIGHT));
        list.add(lecture(22, Space.Wing.D, Space.Floor.GROUND, Space.Side.RIGHT));

        // ----- Classrooms whose location is not confirmed yet -----
        for (int i = 1; i <= 30; i++) {
            if (!isConfirmed(i)) {
                list.add(lecture(i, null, null, null));
            }
        }
        list.add(new Space("auditorium", "Auditorium Hall", null,
                Space.Category.CLASSROOM, "Campus Space",
                null, null, null, Space.Availability.UNKNOWN,
                Space.DataSource.LOCAL));
        list.add(new Space("atrangi", "Atrangi Workspace", null,
                Space.Category.CLASSROOM, "Campus Space",
                null, null, null, Space.Availability.UNKNOWN,
                Space.DataSource.LOCAL));

        // ----- Laboratories with confirmed locations -----
        list.add(lab("lab-cn", "CN Lab", null,
                Space.Wing.B, Space.Floor.SECOND, Space.Side.LEFT));
        list.add(lab("lab-pl-1", "Programming Lab (PL)-1", "PL1",
                Space.Wing.B, Space.Floor.FIRST, Space.Side.RIGHT));
        list.add(lab("lab-cc-1", "CC-1", null,
                Space.Wing.B, Space.Floor.FIRST, Space.Side.LEFT));

        return list;
    }

    private static boolean isConfirmed(int number) {
        return number == 1 || number == 3 || number == 10
                || number == 13 || number == 17 || number == 22;
    }

    private static Space lecture(int number, Space.Wing wing,
                                 Space.Floor floor, Space.Side side) {
        return new Space("lr-" + number, "LR " + number, null,
                Space.Category.CLASSROOM, "Lecture Room",
                wing, floor, side, Space.Availability.UNKNOWN,
                Space.DataSource.LOCAL);
    }

    private static Space lab(String id, String name, String aliases,
                             Space.Wing wing, Space.Floor floor, Space.Side side) {
        return new Space(id, name, aliases,
                Space.Category.LABORATORY, "Laboratory",
                wing, floor, side, Space.Availability.UNKNOWN,
                Space.DataSource.LOCAL);
    }
}