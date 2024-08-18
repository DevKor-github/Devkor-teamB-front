//
//  PointModule.m
//  KUnA
//
//  Created by 송상준 on 8/19/24.
//

#import "RCTPointModule.h"
#import <React/RCTLog.h>

@implementation RCTPointModule

RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}


RCT_EXPORT_MODULE(PointModule);
@end
