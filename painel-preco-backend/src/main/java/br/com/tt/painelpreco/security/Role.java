package br.com.tt.painelpreco.security;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum Role {
    ADMIN(SecurityRoles.ADMIN),
    GESTOR(SecurityRoles.GESTOR),
    USUARIO(SecurityRoles.USUARIO);

    private final String roleName;

    Role(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }

    public String getSpringRole() {
        return "ROLE_" + roleName;
    }

    public static List<String> getAllRoleNames() {
        return Arrays.stream(values())
                .map(Role::getRoleName)
                .collect(Collectors.toList());
    }

    public static Role fromString(String text) {
        for (Role b : Role.values()) {
            if (b.roleName.equalsIgnoreCase(text)) {
                return b;
            }
        }
        return null;
    }
}
