#include <GL/glut.h>     
#include <math.h>        
#include <stdio.h>       
#include <stdlib.h>      

// Global Variables
float angle = 0.0;                              // Rotation angle for windmill blades
float wind_speed = 0.5;                         // Wind speed (controls rotation speed and cloud speed)
float cloud_pos = 0.0;                          // Horizontal movement of clouds
int window_width = 800, window_height = 600;    // Initial window size

// Day/Night cycle
float timeOfDay = 0.0f;                         // Alter factor for day (0.0) to night (1.0)
float dayNightSpeed = 0.0005f;                  // How fast the day-night cycle transitions

// Lighting Setup
void setupLighting() {
    // Light position and characteristics
    GLfloat light_pos[] = { -1.0, 1.0, 0.5, 0.0 };  // Directional light
    GLfloat ambient[] = { 0.3, 0.3, 0.3, 1.0 };     // Ambient light intensity
    GLfloat diffuse[] = { 1.0, 1.0, 0.9, 1.0 };     // Diffuse reflection (sunlight)

    glEnable(GL_LIGHTING);                          // Enable global lighting
    glEnable(GL_LIGHT0);                            // Enable light source 0

    // Assign light properties to LIGHT0
    glLightfv(GL_LIGHT0, GL_POSITION, light_pos);
    glLightfv(GL_LIGHT0, GL_AMBIENT, ambient);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, diffuse);

    // Enable color tracking so glColor affects material
    glEnable(GL_COLOR_MATERIAL);
    glColorMaterial(GL_FRONT, GL_AMBIENT_AND_DIFFUSE);
}

// Drawing Functions

// Draw Sun – bright yellow sphere (only in daytime)
void drawSun() {
    glPushMatrix();                       // Save current matrix
    glDisable(GL_LIGHTING);               // Sun should look self-lit
    glColor3f(1.0, 1.0, 0.0);             // Yellow color
    glTranslatef(0.75f, 0.85f, 0.0f);      // Position in top right corner
    glutSolidSphere(0.08, 30, 30);        // Radius = 0.08, detail level
    glEnable(GL_LIGHTING);                // Restore lighting
    glPopMatrix();                        // Restore matrix
}

// Draw Moon – grayish sphere (only at night)
void drawMoon() {
    glPushMatrix();
    glDisable(GL_LIGHTING);
    glColor3f(0.9, 0.9, 0.9);            // Light gray
    glTranslatef(-0.75f, 0.75f, 0.0f);   // Position top left
    glutSolidSphere(0.05, 30, 30);       // Slightly smaller than sun
    glEnable(GL_LIGHTING);
    glPopMatrix();
}

// Windmill tower – simple rectangular pole
void drawWindmillBase() {
    glColor3f(0.3, 0.2, 0.1);       // Brown color
    glBegin(GL_POLYGON);            // Start quad
    glVertex2f(-0.05, -0.5);        // Bottom left
    glVertex2f(0.05, -0.5);         // Bottom right
    glVertex2f(0.05, 0.3);          // Top right
    glVertex2f(-0.05, 0.3);         // Top left
    glEnd();
}

// Single blade – triangle extending out
void drawBlade() {
    glBegin(GL_TRIANGLES);
    glVertex2f(0.0, 0.0);           // Blade center
    glVertex2f(0.3, 0.05);          // Top outer
    glVertex2f(0.3, -0.05);         // Bottom outer
    glEnd();
}

// Full windmill: base + 4 rotating blades
void drawWindmill() {
    drawWindmillBase();                           // Draw static base

    glPushMatrix();
    glTranslatef(0.0, 0.3, 0.0);                  // Move to top of tower
    glRotatef(angle, 0.0, 0.0, 1.0);              // Rotate all blades

    glColor3f(0.7, 0.1, 0.1);                     // Red blades

    for (int i = 0; i < 4; i++) {
        drawBlade();                              // Draw one blade
        glRotatef(90.0, 0.0, 0.0, 1.0);           // Rotate 90° for next
    }

    glPopMatrix();
}

// Draw a cloud using 5 overlapping spheres
void drawCloud(float x, float y) {
    glPushMatrix();
    glDisable(GL_COLOR_MATERIAL);             // We use lighting materials here

    // Set cloud material properties
    GLfloat cloud_ambient[] = { 1.0f, 1.0f, 1.0f, 1.0f };
    GLfloat cloud_diffuse[] = { 1.0f, 1.0f, 1.0f, 1.0f };
    GLfloat cloud_specular[] = { 0.1f, 0.1f, 0.1f, 1.0f };
    GLfloat cloud_shininess = 5.0f;

    glMaterialfv(GL_FRONT, GL_AMBIENT, cloud_ambient);
    glMaterialfv(GL_FRONT, GL_DIFFUSE, cloud_diffuse);
    glMaterialfv(GL_FRONT, GL_SPECULAR, cloud_specular);
    glMaterialf(GL_FRONT, GL_SHININESS, cloud_shininess);

    // Draw 5 overlapping cloud puffs
    for (int i = 0; i < 5; i++) {
        glPushMatrix();
        glTranslatef(x + i * 0.05, y, 0.0); // Horizontal spacing
        glutSolidSphere(0.03, 15, 15);      // Each puff
        glPopMatrix();
    }

    glEnable(GL_COLOR_MATERIAL);            // Re-enable color material
    glPopMatrix();
}

// Day/Night Background and Lighting
void updateDayNightCycle() {
    // Alter sky color from day to night
    float skyR = 0.52f * (1.0f - timeOfDay) + 0.05f * timeOfDay;
    float skyG = 0.80f * (1.0f - timeOfDay) + 0.05f * timeOfDay;
    float skyB = 0.92f * (1.0f - timeOfDay) + 0.3f * timeOfDay;
    glClearColor(skyR, skyG, skyB, 1.0f);   // Background color

    // Alter ambient light to make it realistic
    GLfloat ambient[] = {
        0.3f * (1.0f - timeOfDay) + 0.05f * timeOfDay,
        0.3f * (1.0f - timeOfDay) + 0.05f * timeOfDay,
        0.3f * (1.0f - timeOfDay) + 0.1f * timeOfDay,
        1.0f
    };
    glLightfv(GL_LIGHT0, GL_AMBIENT, ambient);
}

// Main Drawing Function (Called every frame)
void drawScene() {
    updateDayNightCycle();  // Update sky and lighting

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glLoadIdentity();       // Reset transformation

    // Draw Ground 
    // Alter between green (day) and bluish grey (night)
    float landR = 0.4f * (1.0f - timeOfDay) + 0.15f * timeOfDay;
    float landG = 0.8f * (1.0f - timeOfDay) + 0.15f * timeOfDay;
    float landB = 0.4f * (1.0f - timeOfDay) + 0.35f * timeOfDay;

    glDisable(GL_LIGHTING);
    glColor3f(landR, landG, landB);
    glBegin(GL_POLYGON);
    glVertex2f(-1.0, -0.5); glVertex2f(1.0, -0.5);
    glVertex2f(1.0, -1.0); glVertex2f(-1.0, -1.0);
    glEnd();
    glEnable(GL_LIGHTING);

    // Sun or Moon based on timeOfDay
    if (timeOfDay < 0.5f) drawSun();
    else drawMoon();

    // Windmill
    glPushMatrix();
    glTranslatef(-0.5, -0.1, 0.0);  // Place left-center
    drawWindmill();
    glPopMatrix();

    // Clouds – move horizontally
    drawCloud(-0.9 + fmod(cloud_pos, 2.0), 0.7);
    drawCloud(-0.4 + fmod(cloud_pos * 1.2, 2.0), 0.75);
    drawCloud(0.3 + fmod(cloud_pos * 1.5, 2.0), 0.72);

    glutSwapBuffers(); // Display the frame
}

// Update Function (Called by Timer)
void update(int value) {
    angle -= wind_speed * 5.0;              // Rotate windmill blades
    if (angle > 360.0) angle -= 360.0;

    cloud_pos += wind_speed * 0.01;         // Move clouds

    timeOfDay += dayNightSpeed;             // Animate day/night
    if (timeOfDay > 1.0f) timeOfDay = 0.0f;

    glutPostRedisplay();                    // Redraw the frame
    glutTimerFunc(16, update, 0);           // Re-call this after 16 ms (~60 FPS)
}

// Keyboard Input
void handleKey(unsigned char key, int x, int y) {
    switch (key) {
    case '+': wind_speed += 0.1; break;                      // Increase speed
    case '-': wind_speed -= 0.1;                             // Decrease speed
        if (wind_speed < 0) wind_speed = 0;
        break;                                               //Stop the windmill if speed is 0
    case 's': wind_speed = 0.0; break;                       // Stop windmill
    case 'r': wind_speed = 0.5; angle = 0; break;            // Reset
    case 27: exit(0); break;                                 // ESC to exit
    }
}

// Window Resizing
void reshape(int w, int h) {
    glViewport(0, 0, w, h);                // Set viewport
    glMatrixMode(GL_PROJECTION);           // Switch to projection
    glLoadIdentity();                      // Reset
    gluOrtho2D(-1.0, 1.0, -1.0, 1.0);      // Set orthographic 2D view
    glMatrixMode(GL_MODELVIEW);            // Back to modelview
}

// Main Function
int main(int argc, char** argv) {
    glutInit(&argc, argv);                                           // Init GLUT
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);        // Double buffer, RGB, Depth
    glutInitWindowSize(window_width, window_height);                 // Set window size
    glutCreateWindow("Windmill Simulation with Day and Night Cycle");

    glEnable(GL_DEPTH_TEST);                                         // Enable depth testing
    setupLighting();                                                 // Setup lighting and materials

    glutDisplayFunc(drawScene);                                      // Set display callback
    glutReshapeFunc(reshape);                                        // Set resize callback
    glutKeyboardFunc(handleKey);                                     // Set keyboard handler
    glutTimerFunc(25, update, 0);                                    // Set update loop (starts in 25 ms)

    glutMainLoop();                                                  // Enter the event loop
    return 0;
}
